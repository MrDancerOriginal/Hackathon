import { Answer } from "./answer.interface";

export interface Question {
  questionText: string;
  answers: Answer[];
}
