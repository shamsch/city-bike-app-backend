import express from 'express';
import journeyRouter from './src/routes/journey';
import stationRouter from './src/routes/station';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/journey', journeyRouter)
app.use('/api/station', stationRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log('Server started on port ' + PORT));

// test issue
export default app;
