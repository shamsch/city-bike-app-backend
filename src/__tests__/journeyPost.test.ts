import { expect } from "chai";
import "mocha";

import app from "../..";

import request from "supertest";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

describe("POST /journey/add", () => {
	after(async () => {
		const res = await prisma.journey.deleteMany({
			where: {
				covered_distance: 666555,
			},
		});
		console.log("Number of deleted journeys: ", res.count);
		prisma.$disconnect();
	}),
		it("adding without pass fails", async () => {
			const response = await request(app).post("/api/journey/add").send({
				departure_time: "2021-05-31T23:57:25.000Z",
				return_time: "2021-06-01T00:05:46.000Z",
				departure_station: 1,
				return_station: 2,
				covered_distance: 666.555,
				month: "January",
			});

			expect(response.body.error).to.equal("No pass provided");
			expect(response.status).to.equal(401);
		});

	it("adding with pass is successful", async () => {
		const response = await request(app)
			.post("/api/journey/add")
			.send({
				departure_time: "2021-05-31T23:57:25.000Z",
				return_time: "2021-06-01T00:05:46.000Z",
				departure_station: 1,
				return_station: 1,
				covered_distance: 666.555,
				month: "January",
			})
			.set("pass", process.env.PASS);
		expect(response.status).to.equal(200);
		expect(response.body).to.have.keys(
			"id",
			"departure_station",
			"return_station",
			"covered_distance",
			"departure_time",
			"return_time",
			"month",
			"duration",
			"departure_station_id",
			"return_station_id",
		);
	});

	it("adding with invalid station id fails", async () => {
		const response = await request(app)
			.post("/api/journey/add")
			.send({
				departure_time: "2021-05-31T23:57:25.000Z",
				return_time: "2021-06-01T00:05:46.000Z",
				departure_station: 66666666666666666,
				return_station: 999999999999999999999,
				covered_distance: 666.555,
				month: "January",
			})
			.set("pass", process.env.PASS);
		expect(response.status).to.equal(400);
		expect(response.body.error).to.equal("Invalid data received");
	});

	it("adding with invalid month fails", async () => {
		const response = await request(app)
			.post("/api/journey/add")
			.send({
				departure_time: "2021-05-31T23:57:25.000Z",
				return_time: "2021-06-01T00:05:46.000Z",
				departure_station: 1,
				return_station: 1,
				covered_distance: 666.555,
				month: "Not a month",
			})
			.set("pass", process.env.PASS);
		expect(response.status).to.equal(400);
		expect(response.body.error).to.equal("Invalid data received");
	});

	it("adding with invalid covered distance fails", async () => {
		const response = await request(app)
			.post("/api/journey/add")
			.send({
				departure_time: "2021-05-31T23:57:25.000Z",
				return_time: "2021-06-01T00:05:46.000Z",
				departure_station: 1,
				return_station: 1,
				covered_distance: -666.555,
				month: "January",
			})
			.set("pass", process.env.PASS);
		expect(response.status).to.equal(400);
		expect(response.body.error).to.equal("Invalid data received");
	});
	it("adding with invalid time fails", async () => {
		const response = await request(app)
			.post("/api/journey/add")
			.send({
				departure_time: "NOT A TIME",
				return_time: "NOT A TIME",
				departure_station: 1,
				return_station: 1,
				covered_distance: 666.555,
				month: "January",
			})
			.set("pass", process.env.PASS);
		expect(response.status).to.equal(400);
		expect(response.body.error).to.equal("Invalid data received");
	});
});
