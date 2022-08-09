import { expect } from "chai";
import "mocha";

import app from "../..";
import "dotenv/config";
import request from "supertest";
import { after } from "mocha";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("POST /station/add", () => {
	after(async () => {
		const res = await prisma.station.deleteMany({
			where: {
				name: "TestStation",
			},
		});
		console.log("Number of deleted stations: ", res.count);
		prisma.$disconnect();
	}),
		it("adding without pass fails", async () => {
			const response = await request(app).post("/api/station/add").send({
				name: "TestStation",
				address: "TestAddress 123",
				capacity: 100,
				lon: 24.95,
				lat: 60.16,
			});

			expect(response.body.error).to.equal("No pass provided");
			expect(response.status).to.equal(401);
		});

	it("adding with pass succeeds", async () => {
		const response = await request(app)
			.post("/api/station/add")
			.send({
				name: "TestStation",
				address: "TestAddress 123",
				capacity: 100,
				lon: 24.95,
				lat: 60.16,
			})
			.set("pass", process.env.PASS);

		expect(response.body.error).to.equal(undefined);
		expect(response.status).to.equal(200);
		expect(response.body).to.contain.keys([
			"id",
			"name",
			"address",
			"capacity",
			"lon",
			"lat",
		]);
	});

	it("adding with missing name fails", async () => {
		const response = await request(app)
			.post("/api/station/add")
			.send({
				address: "TestAddress 123",
				capacity: 100,
				lon: 24.95,
				lat: 60.16,
			})
			.set("pass", process.env.PASS);
		expect(response.body.error[0].msg).to.equal("Invalid value");
		expect(response.status).to.equal(400);
	});

	it("adding with missing address fails", async () => {
		const response = await request(app)
			.post("/api/station/add")
			.send({
				name: "TestStation",
				capacity: 100,
				lon: 24.95,
				lat: 60.16,
			})
			.set("pass", process.env.PASS);
		expect(response.body.error[0].msg).to.equal("Invalid value");
		expect(response.status).to.equal(400);
	}),
		it("adding with missing capacity fails", async () => {
			const response = await request(app)
				.post("/api/station/add")
				.send({
					name: "TestStation",
					address: "TestAddress 123",
					lon: 24.95,
					lat: 60.16,
				})
				.set("pass", process.env.PASS);
			expect(response.body.error[0].msg).to.equal("Invalid value");
			expect(response.status).to.equal(400);
		}),
		it("adding with missing lat and lon fails", async () => {
			const response = await request(app)
				.post("/api/station/add")
				.send({
					name: "TestStation",
					address: "TestAddress 123",
					capacity: 100,
				})
				.set("pass", process.env.PASS);
			expect(response.body.error[0].msg).to.equal("Invalid value");
			expect(response.status).to.equal(400);
		});

	it("adding with invalid capacity fails", async () => {
		const response = await request(app)
			.post("/api/station/add")
			.send({
				name: "TestStation",
				address: "TestAddress 123",
				capacity: -1, //must be non-negative integer
				lon: 24.95,
				lat: 60.16,
			})
			.set("pass", process.env.PASS);
		expect(response.body.error[0].msg).to.equal("Invalid value");
		expect(response.status).to.equal(400);
	});
});
