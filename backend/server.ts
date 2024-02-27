import app from './src/app';
import http from 'http';

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});

