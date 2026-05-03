import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionRequest, SubmissionResponse } from '../../interfaces/submissions.interface';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://exam-app.elevate-bootcamp.cloud/api/submissions';

  /**
   * Submit exam answers
   * @param payload Submission request payload
   * @returns Observable of SubmissionResponse
   */
  submitExam(payload: SubmissionRequest): Observable<SubmissionResponse> {
    return this.http.post<SubmissionResponse>(this.baseUrl, payload);
  }

  /**
   * Get submission by ID
   * @param id Submission ID
   * @returns Observable of SubmissionResponse
   */
  getSubmissionById(id: string): Observable<SubmissionResponse> {
    return this.http.get<SubmissionResponse>(`${this.baseUrl}/${id}`);
  }
}
