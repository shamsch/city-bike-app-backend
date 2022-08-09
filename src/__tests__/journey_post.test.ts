import { expect } from "chai";
import "mocha";

import app from "../..";

import request from "supertest";

describe("POST /journey/add", () => {
	it("adding without pass fails", async () => {
		const response = await request(app).post("/api/journey/add").send({
			departure_time: "2021-05-31T23:57:25.000Z",
			return_time: "2021-06-01T00:05:46.000Z",
			departure_station_id: 1,
			return_station_id: 2,
			covered_distance: 0.5,
			month: "May",
		});

		expect(response.body.error).to.equal("No pass provided");
		expect(response.status).to.equal(401);
	});
});
