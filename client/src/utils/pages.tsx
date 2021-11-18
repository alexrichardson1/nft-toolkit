const wrongPage = (
  generative: boolean,
  pageNumber: number,
  PAGE_NUMBER: number
): boolean => {
  return !(generative && pageNumber === PAGE_NUMBER);
};

export { wrongPage };
