import { ClientClosedError, createClient } from "redis";
import "dotenv/config";

const redis = createClient({
    socket: {
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
    },
    password: process.env.REDIS_PASSWORD,
})

redis.connect().then(() => {
    console.log("Redis connected")
}).catch(err => {
    console.log(err)
})

redis.on("error", (err: ClientClosedError) => {
    console.log("Error " + err);
})

export default redis;