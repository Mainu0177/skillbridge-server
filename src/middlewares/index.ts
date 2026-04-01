import cookieParser from 'cookie-parser';
import cors from 'cors';
import { type Express } from 'express';

import { corsConfig } from '../config/cors';

export const applyMiddleware = (app: Express): void => {
    app.use(cors(corsConfig));

    app.use(cookieParser());

};