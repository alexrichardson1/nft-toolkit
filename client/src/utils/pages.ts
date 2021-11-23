export const wrongStepGenerative = (
  generative: boolean,
  stepNumber: number,
  STEP_NUMBER: number
): boolean => {
  return !(generative && stepNumber === STEP_NUMBER);
};

export const wrongStepStatic = (
  generative: boolean,
  stepNumber: number,
  STEP_NUMBER: number
): boolean => {
  return generative || stepNumber !== STEP_NUMBER;
};

export const wrongStep = (stepNumber: number, STEP_NUMBER: number): boolean => {
  return stepNumber !== STEP_NUMBER;
};
