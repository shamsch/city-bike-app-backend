import { Router } from "express";
import { body, validationResult } from "express-validator";
import { verifyPostRequestPass } from "../middleware/verifyPostRequestPass";
import {
	addStation,
	getAllStations,
	getStationById,
	getStationOptions,
} from "../services/station";
import {
	StationGetRequest,
	StationGetResponse,
	StationGetByIdRequest,
	StationGetByIdResponse,
	StationPostRequest,
	StationPostResponse,
} from "../types";
import redis from "../utils/redisConnection";
import { validateMonth } from "../utils/validateMonthAndDate";

const stationRouter = Router();

stationRouter.get(
	"/",
	async (req: StationGetRequest, res: StationGetResponse) => {
		const limit = Number(req.query.limit) || 10;
		const page = Number(req.query.page) || 1;
		const search = req.query.search;
		const stations = await getAllStations(page, limit, search);
		res.json(stations);
	}
);

stationRouter.get("/stationOptions", async (req, res) => {
	const stations = await getStationOptions();
	res.json(stations);
});

stationRouter.get(
	"/:id",
	async (req: StationGetByIdRequest, res: StationGetByIdResponse) => {
		const id = Number(req.params.id);
		const month = req.query.month
			? validateMonth(req.query.month)
				? req.query.month
				: undefined
			: "";
		const redisKey = `station:${id}:${month}`;
		if (isNaN(id)) {
			res.status(400).json({ error: "Invalid id" });
		} else {
			const cached = await redis.exists(redisKey);
			if(cached) {
				const station = await redis.get(redisKey);
				station ? res.json(JSON.parse(station)) : null;
			} else {
				const station = await getStationById(id, month);
				if (!station) {
					res.status(404).json({ error: "Station not found" });
				} else {
					await redis.set(redisKey, JSON.stringify(station));
					res.json(station);
				}
			}
		}
	}
);

stationRouter.post(
	"/add",
	verifyPostRequestPass,
	body("name").isString().isLength({ min: 1 }),
	body("address").isString().isLength({ min: 1 }),
	body("lat").isFloat(),
	body("lon").isFloat(),
	body("capacity").isInt({ gt: 0 }),
	async (req: StationPostRequest, res: StationPostResponse) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ error: errors.array() });
		} else {
			const { name, address, lat, lon, capacity } = req.body;
			const station = await addStation(name, address, lat, lon, capacity);
			res.json(station);
		}
	}
);
export default stationRouter;
