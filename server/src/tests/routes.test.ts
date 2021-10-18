import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.use(chaiHttp);

const HTTP_OK_STATUS = 200;

describe("API calls", () => {
  describe("/GET", () => {
    it("it should GET hello world", (done) => {
      chai
        .request(app)
        .get("/")
        .end((_err, res) => {
          expect(res.status).to.equal(HTTP_OK_STATUS);
          expect(res.text).to.equal("Hello world!");
          done();
        });
    });
  });
});
