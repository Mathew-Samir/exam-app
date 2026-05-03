export interface Exam {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  createdAt: string;
  questionsCount: number;
}

export interface Diploma {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  exams?: Exam[];
}

export interface DiplomaApiResponse {
  status: boolean;
  code: number;
  payload: {
    data: Diploma[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
export interface SingleDiplomaResponse {
  status: boolean;
  code: number;
  payload: {
    diploma: Diploma;
  };
}
export interface SingleExamResponse {
  status: boolean;
  code: number;
  payload: {
    exam: Exam;
  };
}
