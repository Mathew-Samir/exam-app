export interface Answer {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    text: string;
    answers: Answer[];
    examId?: string;
    immutable?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface QuestionsApiResponse {
    status: boolean;
    code: number;
    payload: {
        questions: Question[];
    };
}
