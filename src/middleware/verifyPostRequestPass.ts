import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export const verifyPostRequestPass = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// check if there is a pass in the request header
	if (req.headers.pass) {
		// check if the pass is correct
		if (req.headers.pass === process.env.PASS) {
			next();
		} else {
			res.status(401).json({ error: "Invalid pass" });
		}
	} else {
		res.status(401).json({ error: "No pass provided" });
	}
};
