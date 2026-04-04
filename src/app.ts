import express, {type Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { AuthRoutes } from './modules/Auth/auth.route';
import { TutorRoutes } from './modules/tutor/tutor.route';
import { corsConfig } from './config/cors';
import { envConfig } from './config/env';
import { applyMiddleware } from './middlewares';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

// parsers
app.use(express.json({ limit: '1mb' }));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsConfig));

// application routes
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/tutor', TutorRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Mainuddin Khan!');
});

// export const startServer = async () => {
//   try {

//       applyMiddleware(app);

//       const PORT = envConfig.PORT || 5000;
//       app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//       });
//     } catch (error) {
//       console.error('Error initializing app:', error);
//       process.exit(1);
//     }
// };
app.use(notFound);
app.use(errorHandler);

export default app;
