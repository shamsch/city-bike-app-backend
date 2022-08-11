import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const seed = async () => {
	await prisma.station.deleteMany({});
	await prisma.journey.deleteMany({});

	fs.createReadStream(path.join(__dirname, "../csv/validated/stations.csv"))
		.pipe(csv())
		.on("data", async (data: any) => {
			await prisma.station.create({
				data: {
					id: Number(data["id"]),
					name: String(data["name"]),
					lat: Number(data["lat"]),
					lon: Number(data["lon"]),
					address: String(data["address"]),
					capacity: Number(data["capacity"]),
				},
			});
		});

	console.log("successfully seeded stations, now seeding journeys ...");

	fs.createReadStream(path.join(__dirname, "../csv/validated/journey_all.csv"))
		.pipe(csv())
		.on("data", async (data: any) => {
			const departureStation = await prisma.station.findUnique({
				where: {
					id: Number(data["departure_station_id"]),
				},
			});
			const returnStation = await prisma.station.findUnique({
				where: {
					id: Number(data["return_station_id"]),
				},
			});

			if (!departureStation || !returnStation) {
				return;
			}

			await prisma.journey.create({
				data: {
					covered_distance: Number(data["covered_distance"]),
					departure_station: String(data["departure_station"]),
					departure_time: new Date(data["departure_time"]),
					duration: Number(data["duration"]),
					departure_station_id: Number(data["departure_station_id"]),
					month: String(data["month"]),
					return_station: String(data["return_station"]),
					return_time: new Date(data["return_time"]),
					return_station_id: Number(data["return_station_id"]),
				},
			});
		})
		.on("error", (err: any) => {
			console.log(err);
		});
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
