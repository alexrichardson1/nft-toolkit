import { wrongStep, wrongStepGenerative, wrongStepStatic } from "utils/pages";

describe("Pages Checks", () => {
  describe("wrongStep", () => {
    test("wrongStep returns true when STEP_NUMBER !== stepNumber", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 1;
      expect(wrongStep(stepNumber, STEP_NUMBER)).toBe(true);
    });
    test("wrongStep returns false when STEP_NUMBER === stepNumber", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 0;
      expect(wrongStep(stepNumber, STEP_NUMBER)).toBe(false);
    });
  });

  describe("wrongStepGenerative", () => {
    test("wrongStepGenerative returns true when STEP_NUMBER !== stepNumber", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 1;
      const generative = true;
      expect(wrongStepGenerative(generative, stepNumber, STEP_NUMBER)).toBe(
        true
      );
    });
    test("wrongStepGenerative returns true when generative === false", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 0;
      const generative = false;
      expect(wrongStepGenerative(generative, stepNumber, STEP_NUMBER)).toBe(
        true
      );
    });
    test("wrongStepGenerative returns false when STEP_NUMBER === stepNumber and generative === true", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 0;
      const generative = true;
      expect(wrongStepGenerative(generative, stepNumber, STEP_NUMBER)).toBe(
        false
      );
    });
  });

  describe("wrongStepStatic", () => {
    test("wrongStepStatic returns true when STEP_NUMBER !== stepNumber", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 1;
      const generative = true;
      expect(wrongStepStatic(generative, stepNumber, STEP_NUMBER)).toBe(true);
    });
    test("wrongStepStatic returns true when generative === true", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 0;
      const generative = true;
      expect(wrongStepStatic(generative, stepNumber, STEP_NUMBER)).toBe(true);
    });
    test("wrongStepStatic returns false when STEP_NUMBER === stepNumber and generative === false", () => {
      const stepNumber = 0;
      const STEP_NUMBER = 0;
      const generative = false;
      expect(wrongStepStatic(generative, stepNumber, STEP_NUMBER)).toBe(false);
    });
  });
});
