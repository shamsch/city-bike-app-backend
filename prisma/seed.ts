import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JOURNEY_AFTER_SEED = 3123974;
const STATION_AFTER_SEED = 456;

export const seed = async () => {
	const journeysCount = await prisma.journey.count();
	const stationsCount = await prisma.station.count();

	if (
		journeysCount >= JOURNEY_AFTER_SEED &&
		stationsCount >= STATION_AFTER_SEED
	) {
		console.log("Database already seeded");
		return;
	}

	await prisma.journey.deleteMany({});
	await prisma.station.deleteMany({});
	await prisma.$executeRaw`COPY "Station" ("id", "name", "address", "capacity", "lon", "lat") FROM '/csv/validated/stations.csv' WITH DELIMITER ',' CSV HEADER;`;
	console.log("Seeding complete for stations");
	await prisma.$executeRaw`COPY "Journey" (
		"departure_time","return_time","departure_station_id","departure_station","return_station_id","return_station","duration","covered_distance","month") FROM '/csv/validated/journey_all.csv' WITH DELIMITER ',' CSV HEADER;`;
	console.log("Seeding complete for journeys");
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
