import { wrongPage, wrongPageGenerative, wrongPageStatic } from "utils/pages";

describe("Pages Checks", () => {
  describe("wrongPage", () => {
    test("wrongPage returns true when PAGE_NUMBER !== pageNumber", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 1;
      expect(wrongPage(pageNumber, PAGE_NUMBER)).toBe(true);
    });
    test("wrongPage returns false when PAGE_NUMBER === pageNumber", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 0;
      expect(wrongPage(pageNumber, PAGE_NUMBER)).toBe(false);
    });
  });

  describe("wrongPageGenerative", () => {
    test("wrongPageGenerative returns true when PAGE_NUMBER !== pageNumber", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 1;
      const generative = true;
      expect(wrongPageGenerative(generative, pageNumber, PAGE_NUMBER)).toBe(
        true
      );
    });
    test("wrongPageGenerative returns true when generative === false", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 0;
      const generative = false;
      expect(wrongPageGenerative(generative, pageNumber, PAGE_NUMBER)).toBe(
        true
      );
    });
    test("wrongPageGenerative returns false when PAGE_NUMBER === pageNumber and generative === true", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 0;
      const generative = true;
      expect(wrongPageGenerative(generative, pageNumber, PAGE_NUMBER)).toBe(
        false
      );
    });
  });
  describe("wrongPageStatic", () => {
    test("wrongPageStatic returns true when PAGE_NUMBER !== pageNumber", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 1;
      const generative = true;
      expect(wrongPageStatic(generative, pageNumber, PAGE_NUMBER)).toBe(true);
    });
    test("wrongPageStatic returns true when generative === true", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 0;
      const generative = true;
      expect(wrongPageStatic(generative, pageNumber, PAGE_NUMBER)).toBe(true);
    });
    test("wrongPageStatic returns false when PAGE_NUMBER === pageNumber and generative === false", () => {
      const pageNumber = 0;
      const PAGE_NUMBER = 0;
      const generative = false;
      expect(wrongPageStatic(generative, pageNumber, PAGE_NUMBER)).toBe(false);
    });
  });
});
