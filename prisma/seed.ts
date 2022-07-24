import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import csv_parser from "csv-parser";
import fs from "fs";
import path from "path";

const csv = csv_parser();

async function main() {
    fs.createReadStream(path.join(__dirname, "../data/csv_small/station.csv"))
        .pipe(csv)
        .on("data", async (data: any) => {
            await prisma.station.create({
                data: {
                    id: Number(data.id),
                    name: String(data.name),
                    lat: Number(data.lat),
                    lon: Number(data.lon),
                    city: String(data.city),
                    address: String(data.address),
                    capacity: Number(data.capacity),
                    operator: String(data.operator),
                },
            });
        });

    fs.createReadStream(path.join(__dirname, "../data/csv_small/journey.csv"))
        .pipe(csv)
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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
