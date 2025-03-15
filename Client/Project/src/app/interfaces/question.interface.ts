import { Answer } from "./answer.interface";

export interface Question {
  id: number;
  text: string;
  order: number;
  answers: Answer[];
}
