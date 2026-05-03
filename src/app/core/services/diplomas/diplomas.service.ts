import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import {
  Diploma,
  DiplomaApiResponse,
  SingleDiplomaResponse,
  Exam,
  SingleExamResponse,
} from "../../interfaces/diploma.interface";
import { QuestionsApiResponse, Question } from "../../interfaces/questions.interface";

/**
 * DiplomasService
 * Handles fetching diploma data, individual diploma details,
 * exam details, and exam questions from the API.
 */
@Injectable({
  providedIn: "root",
})
export class DiplomasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = "https://exam-app.elevate-bootcamp.cloud/api";

  /**
   * Get all diplomas from the API
   * Handles multiple possible response structures for resilience
   * @returns Observable of Diploma array
   */
  getDiplomas(): Observable<Diploma[]> {
    return this.http.get<DiplomaApiResponse>(`${this.baseUrl}/diplomas`).pipe(
      map((response: unknown) => {
        const res = response as Record<string, unknown>;
        const payload = res?.['payload'] as Record<string, unknown> | Diploma[] | undefined;

        if (payload && !Array.isArray(payload)) {
          if (Array.isArray(payload['data'])) {
            return payload['data'] as Diploma[];
          }
          if (Array.isArray(payload['diplomas'])) {
            return payload['diplomas'] as Diploma[];
          }
        }
        if (Array.isArray(payload)) {
          return payload as Diploma[];
        }
        return [];
      })
    );
  }

  /**
   * Get diploma by ID with its exams
   * @param id - Diploma ID
   * @returns Observable of Diploma
   */
  getDiplomaById(id: string): Observable<Diploma> {
    return this.http
      .get<SingleDiplomaResponse>(`${this.baseUrl}/diplomas/${id}`)
      .pipe(map((response) => response.payload.diploma));
  }

  /**
   * Get exam by ID with its details
   * @param id - Exam ID
   * @returns Observable of Exam
   */
  getExamById(id: string): Observable<Exam> {
    return this.http
      .get<SingleExamResponse>(`${this.baseUrl}/exams/${id}`)
      .pipe(map((response) => response.payload.exam));
  }

  /**
   * Get questions for a specific exam
   * @param examId - Exam ID
   * @returns Observable of Question array
   */
  getQuestionsByExamId(examId: string): Observable<Question[]> {
    return this.http
      .get<QuestionsApiResponse>(`${this.baseUrl}/questions/exam/${examId}`)
      .pipe(map((response) => response.payload.questions));
  }
}
