export interface SubmissionRequest {
  examId: string;
  answers: {
    questionId: string;
    answerId: string;
  }[];
  startedAt: string;
}

export interface SubmissionResponse {
  status: boolean;
  code: number;
  payload: {
    submission: Submission;
    analytics: Analytics[];
  };
}

export interface Submission {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  exam: {
    id: string;
    title: string;
    duration: number;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  questionId: string;
  questionText: string;
  selectedAnswer: { id: string; text: string; } | null;
  isCorrect: boolean;
  correctAnswer: { id: string; text: string; };
}
