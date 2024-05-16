import express from 'express';
import sharedBusinessRoutes from './shared-business-routes';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const app = express();

app.use(express.json());
app.use(sharedBusinessRoutes);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
