const wrongPageGenerative = (
  generative: boolean,
  pageNumber: number,
  PAGE_NUMBER: number
): boolean => {
  return !(generative && pageNumber === PAGE_NUMBER);
};

const wrongPageStatic = (
  generative: boolean,
  pageNumber: number,
  PAGE_NUMBER: number
): boolean => {
  return generative || pageNumber !== PAGE_NUMBER;
};

const wrongPage = (pageNumber: number, PAGE_NUMBER: number): boolean => {
  return pageNumber !== PAGE_NUMBER;
};

export { wrongPageGenerative, wrongPageStatic, wrongPage };
