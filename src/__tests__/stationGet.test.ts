import "mocha";
import app from "../..";
import request from "supertest";
import { expect } from "chai";

describe("GET /api/station", () => {
	it("return 10 station by default", async () => {
		const response = await request(app).get("/api/station");

		expect(response.status).to.equal(200);

		expect(response.body.stations).to.be.an("array");

		expect(response.body.stations).to.have.lengthOf(10);
	});
	it("serach by station name works", async () => {
		const response = await request(app).get("/api/station?search=Kaivopuisto");

		expect(response.status).to.equal(200);
		expect(response.body.stations).to.be.an("array");

		if (response.body.stations.length > 0) {
			expect(response.body.stations[0].name).to.equal("Kaivopuisto");
		}
	});
});

describe("GET /api/station/:id", () => {
	it("return station with id", async () => {
		const response = await request(app).get("/api/station/1");

		expect(response.status).to.equal(200);

		expect(response.body).to.be.an("object");

		expect(response.body).to.have.all.keys([
			"id",
			"name",
			"address",
			"lat",
			"lon",
			"departure_journey",
			"return_journey",
			"average_departure_distance",
			"average_return_distance",
			"top_departure_station",
			"top_return_station",
			"static_map_url",
		]);
	});

	it("return 404 if station not found", async () => {
		const response = await request(app).get("/api/station/9999999999999999");

		expect(response.status).to.equal(404);
	});

	it("non-number id returns 400", async () => {
		const response = await request(app).get("/api/station/abc");

		expect(response.status).to.equal(400);
	});

	it("when queried with invalid month returns all same as all month", async () => {
		const fakeMonthResponse = await request(app).get(
			"/api/station/1?month=abc"
		);
		const allMonthResponse = await request(app).get("/api/station/1");

		expect(fakeMonthResponse.status).to.equal(200);
		expect(allMonthResponse.status).to.equal(200);
		expect(fakeMonthResponse.body).to.deep.equal(allMonthResponse.body);
	});

	it("when queried with valid month returns only that month", async () => {
		const realMonthResponse = await request(app).get(
			"/api/station/1?month=January"
		);
		const allMonthResponse = await request(app).get("/api/station/1");

		expect(realMonthResponse.status).to.equal(200);
		expect(allMonthResponse.status).to.equal(200);
		expect(realMonthResponse.body).to.not.deep.equal(allMonthResponse.body);
	});
});

describe("GET /api/station/stationOptions", () => {
	it("return stationOptions", async () => {
		const response = await request(app).get("/api/station/stationOptions");

		expect(response.status).to.equal(200);

		expect(response.body).to.be.an("array");

		expect(response.body[0]).to.have.all.keys(["id", "name"]);
	});
});
