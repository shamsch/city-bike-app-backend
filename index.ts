const express = require('express');
const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/journey', async (_req: any, res: any) => {
    const journeys = await prisma.journey.findMany();
    res.json(journeys);
}
);

app.get('/station', async (_req:any, res: any) => {
    const stations = await prisma.station.findMany();
    res.json(stations);
}
);

app.listen(4000, () => console.log('Server started on port 4000'));



