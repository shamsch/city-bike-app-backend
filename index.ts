import express from 'express';
import { PrismaClient } from '@prisma/client';
import journeyRouter from './src/routes/journey';
import stationRouter from './src/routes/station';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use('/api/journey', journeyRouter)
app.use('/api/station', stationRouter)


app.listen(4000, () => console.log('Server started on port 4000'));

// test issue

