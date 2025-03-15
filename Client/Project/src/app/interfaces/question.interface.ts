import { Answer } from "./answer.interface";
import { Test } from "./test.interface";

export interface Question {
  id: number;
  testId: number;
  test: Test;
  text: string;
  order: number;
  answers: Answer[];
}
