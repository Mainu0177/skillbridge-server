import express, {type Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { toNodeHandler } from "better-auth/node";
import { AuthRoutes } from './modules/Auth/auth.route';
import { TutorRoutes, tutorsRouterPublic } from './modules/tutor/tutor.route';
import { corsConfig } from './config/cors';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { auth } from './lib/auth';
import studentRoutes from "./modules/student/student.route";
import bookingRoutes from "./modules/booking/booking.route";
import sharedRoutes from "./modules/shared/shared.route";
import adminRoutes from "./modules/admin/admin.route";
import reviewRoutes from "./modules/review/review.route";


// parsers
const app: Express = express();
app.all("/api/auth/*splat", toNodeHandler(auth));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(cors(corsConfig));


app.use("/api/auth",AuthRoutes) // auth routes
app.use("/api/tutor",TutorRoutes) // only tutor private routes
app.use("/api/review",reviewRoutes) // only tutor private routes
app.use("/api/tutors",tutorsRouterPublic) // tutors public access routes
app.use("/api/booking",bookingRoutes) // student only booking routes
app.use("/api/student",studentRoutes) // student only 
app.use("/api/admin",adminRoutes) // admin only 
app.use("/api/shared",sharedRoutes) // shared or public apis only 
app.get("/welcome-page",(req,res)=>{
  res.send("welcome to our my app")
})
app.get('/check-time', (req, res) => {
    res.json({
        serverTime: new Date().toISOString(),
        localTime: new Date().toLocaleString()
    });
})

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
