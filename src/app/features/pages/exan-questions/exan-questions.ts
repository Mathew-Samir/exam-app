import { Component, signal, computed, inject, OnInit, effect, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProgresBar } from "./components/progres-bar/progres-bar";
import { ProgresTime } from "./components/progres-time/progres-time";
import { RadioButtonModule } from "primeng/radiobutton";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { Question } from "../../../core/interfaces/questions.interface";
import { DiplomasService } from "../../../core/services/diplomas/diplomas.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SkeletonModule } from "primeng/skeleton";
import { SubmissionsService } from "../../../core/services/submissions/submissions.service";
import { SubmissionRequest } from "../../../core/interfaces/submissions.interface";

@Component({
    selector: "app-exan-questions",
    imports: [
        CommonModule,
        ProgresBar,
        ProgresTime,
        RadioButtonModule,
        ButtonModule,
        FormsModule,
        SkeletonModule
    ],
    templateUrl: "./exan-questions.html",
    styleUrl: "./exan-questions.scss",
})
export class ExanQuestions implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly diplomasService = inject(DiplomasService);
    private readonly submissionsService = inject(SubmissionsService);
    private readonly destroyRef = inject(DestroyRef);
    
    startedAt = signal<string>(new Date().toISOString());
    diplomaId = signal<string | null>(null);
    examId = signal<string | null>(null);
    questions = signal<Question[]>([]);
    isLoading = signal(true);
    examTitle = signal<string>("Exam Quiz");
    duration = signal<number>(0);

    currentIndex = signal(0);
    userAnswers = signal<Record<string, string>>({});
    selectedAnswer = signal<string | null>(null);

    currentQuestion = computed(() => {
        const qs = this.questions();
        const idx = this.currentIndex();
        return qs[idx];
    });
    totalQuestions = computed(() => this.questions().length);

    constructor() {
        // Sync selectedAnswer with userAnswers when currentIndex changes
        effect(() => {
            const currentQ = this.currentQuestion();
            if (currentQ) {
                const savedAnswer = this.userAnswers()[currentQ.id];
                this.selectedAnswer.set(savedAnswer || null);
            }
        });

        // Save state to localStorage whenever answers or index changes
        effect(() => {
            const eId = this.examId();
            if (eId) {
                const state = {
                    currentIndex: this.currentIndex(),
                    userAnswers: this.userAnswers(),
                    startedAt: this.startedAt()
                };
                localStorage.setItem(`exam_state_${eId}`, JSON.stringify(state));
            }
        });
    }

    ngOnInit() {
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
            const dId = params.get('diplomaId');
            const eId = params.get('examId');
            this.diplomaId.set(dId);
            this.examId.set(eId);
            
            if (eId) {
                this.loadExamData(eId);
                this.loadPersistedState(eId);
            }
        });
    }

    loadPersistedState(examId: string) {
        const savedState = localStorage.getItem(`exam_state_${examId}`);
        if (savedState) {
            try {
                const { currentIndex, userAnswers, startedAt } = JSON.parse(savedState);
                this.currentIndex.set(currentIndex || 0);
                this.userAnswers.set(userAnswers || {});
                if (startedAt) {
                    this.startedAt.set(startedAt);
                }
            } catch (e) {
                console.error("Error parsing saved exam state", e);
            }
        }
    }

    loadExamData(id: string) {
        this.isLoading.set(true);
        
        forkJoin({
            exam: this.diplomasService.getExamById(id),
            questions: this.diplomasService.getQuestionsByExamId(id)
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
                const fetchedQuestions = res.questions || [];
                this.questions.set(fetchedQuestions);
                this.examTitle.set(res.exam.title || "Exam Quiz");
                this.duration.set(res.exam.duration || 10);
                
                // Safety: if saved index is out of bounds for new data
                if (this.currentIndex() >= fetchedQuestions.length) {
                    this.currentIndex.set(0);
                }
                
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    onAnswerSelect(answerId: string) {
        const currentQ = this.currentQuestion();
        if (currentQ) {
            this.userAnswers.update(answers => ({
                ...answers,
                [currentQ.id]: answerId
            }));
        }
    }

    nextQuestion() {
        if (this.currentIndex() < this.totalQuestions() - 1) {
            this.currentIndex.update(i => i + 1);
        }
    }

    prevQuestion() {
        if (this.currentIndex() > 0) {
            this.currentIndex.update(i => i - 1);
        }
    }

    finishExam() {
        const eId = this.examId();
        const dId = this.diplomaId();
        
        if (eId && dId) {
            const answers = Object.entries(this.userAnswers()).map(([questionId, answerId]) => ({
                questionId,
                answerId
            }));

            const payload: SubmissionRequest = {
                examId: eId,
                answers: answers,
                startedAt: this.startedAt()
            };

            this.isLoading.set(true);
            this.submissionsService.submitExam(payload).subscribe({
                next: (res) => {
                    this.isLoading.set(false);
                    if (res.status) {
                        // Clear persisted state on successful finish
                        localStorage.removeItem(`exam_state_${eId}`);
                        this.router.navigate(['/dashboard/diplomas', dId, 'exams', eId, 'results'], {
                            queryParams: { submissionId: res.payload.submission.id }
                        });
                    }
                },
                error: (err) => {
                    this.isLoading.set(false);
                    console.error("Error submitting exam:", err);
                }
            });
        }
    }
}
