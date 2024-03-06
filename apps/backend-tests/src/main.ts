// TODO! Add automated tests before merging to 
// the main branch.

import express from 'express';
import bunyan from 'bunyan';
import axios from 'axios';

// TODO! Figure out why this can't be imported from 
// a library
import { appSettings } from './app-settings';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const app = express();
app.use(express.json());

const papertrailStream = {  
  write: async function(logEntry: object) {     
     await axios.post(appSettings.logsCollectorUrl, logEntry, {
       auth: {
         username: '',
         password: appSettings.logsCollectorApiKey,
       }
     }).catch(error => {
       throw error;
     });
  },
  reemitErrorEvents: true,
  type: 'raw',  
 };

const logger = bunyan.createLogger({
  name: 'myapp',
  streams: [{
    stream: papertrailStream,     
  }]
 });

logger.on('error', (error: unknown) => {
  throw error;
});

// Route for logging
app.post('/api/log/error', async (req, res) => {
  try {
    logger.error(req.body, 'Sending it to the logs collector');
    res.send({ message: 'Log received' });
  } catch (error) {
    // TODO! Create a file level logger for this hopefully rare case
    console.error(error, 'Failed to log request');
    res.status(500).send({ message: 'Failed to log request' });
  }
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
