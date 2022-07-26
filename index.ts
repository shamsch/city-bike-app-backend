import express from "express";
import journeyRouter from "./src/routes/journey";
import stationRouter from "./src/routes/station";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/journey", journeyRouter);
app.use("/api/station", stationRouter);

app.use("/", (_req, res) => {
    res.send("Welcome to the City Bike App API");
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("Server started on port " + PORT));

// deploy to heroku
export default app;
