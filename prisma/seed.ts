import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const seed = async () => {
	fs.createReadStream(path.join(__dirname, "../csv/validated/journey_all.csv"))
		.pipe(csv())
		.on("data", async (data: any) => {
			await prisma.journey.create({
				data: {
					id: Number(data.id),
					covered_distance: Number(data.covered_distance),
					departure_station: String(data.departure_station),
					departure_time: new Date(data.departure_time),
					duration: Number(data.duration),
					departure_station_id: Number(data.departure_station_id),
					month: String(data.month),
					return_station: String(data.return_station),
					return_time: new Date(data.return_time),
					return_station_id: Number(data.return_station_id),
				},
			});
		});

	fs.createReadStream(path.join(__dirname, "../csv/validated/station.csv"))
		.pipe(csv())
		.on("data", async (data: any) => {
			await prisma.station.create({
				data: {
					id: Number(data.id),
					name: String(data.name),
					lat: Number(data.lat),
					lon: Number(data.lon),
					address: String(data.address),
					capacity: Number(data.capacity),
				},
			});
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
