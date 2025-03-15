import { Question } from "./question.interface";

export interface Answer {
  id: number;
  questionId: number;
  question: Question;
  text: string;
  isCorrect: boolean;
}
