import { expect } from "chai";
import "mocha";

import app from "../..";

import request from "supertest";

describe("POST /station/add", () => {
	it("adding without pass fails", async () => {
		const response = await request(app).post("/api/station/add").send({
			name: "Laivasillankatu",
			address: "Laivasillankatu 14",
			capacity: 12,
			lon: 24.9565097715858,
			lat: 60.1609890692806,
		});

		expect(response.body.error).to.equal("No pass provided");
		expect(response.status).to.equal(401);
	});
});
