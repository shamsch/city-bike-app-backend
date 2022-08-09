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
				covered_distance: 666.555,
			},
		});
		console.log("Number of deleted journeys: ", res.count);
		prisma.$disconnect();
	}),
		it("adding without pass fails", async () => {
			const response = await request(app).post("/api/journey/add").send({
				departure_time: "2021-05-31T23:57:25.000Z",
				return_time: "2021-06-01T00:05:46.000Z",
				departure_station_id: 1,
				return_station_id: 2,
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
				departure_station_id: 1,
				return_station_id: 1,
				covered_distance: 666.555,
				month: "January",
			})
			.set("pass", process.env.PASS);
		console.log(response.body);
		expect(response.status).to.equal(200);
	});
});
