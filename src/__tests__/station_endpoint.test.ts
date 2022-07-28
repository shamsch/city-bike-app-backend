import "mocha"
import app from "../.."
import request from "supertest"
import { expect } from "chai"

describe("Expect station to", () => {
    it("return 10 station by default", async () => {
        const response = await request(app).get("/api/station");

        expect(response.status).to.equal(200);

        expect(response.body.stations).to.be.an("array");

        expect(response.body.stations).to.have.lengthOf(10);
    }
    )
}
)