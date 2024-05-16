import express from 'express';
import sharedBusinessRoutes from './shared-business-routes';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const app = express();

/**
 * NOTE! 
 * DON'T REMOVE THIS ROUTE!!!
 * Otherwise, the targets depending on backend will fail.
 * Why?
 * Because the routines which start the backend for those
 * targets (e.g. the e2e is typical one) are waiting 
 * when this route becomes available and fail after a timeout.
 */
app.get('/', (req, res) => {
  res.status(200).send({});
});

app.use(express.json());
app.use(sharedBusinessRoutes);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
