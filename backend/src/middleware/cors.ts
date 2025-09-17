import cors from 'cors';

const corsOptions = {
  origin: ['http://localhost:5173', 'https://bernardo-kra.github.io'],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
