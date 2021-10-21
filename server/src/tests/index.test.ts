import request from "supertest";
import app from "../index";

const HTTP_OK_STATUS = 200;

describe("API calls", () => {
  const server = request(app);

  describe("/GET", () => {
    it("Should GET hello world", async () => {
      const response = await server.get("/");
      expect(response.statusCode).toBe(HTTP_OK_STATUS);
      expect(response.text).toBe("Hello world!");
    });
  });
});
