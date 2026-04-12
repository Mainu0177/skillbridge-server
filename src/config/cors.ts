export const corsConfig = {
    origin: ['http://localhost:5000',"https://skillbridgeclient-pied.vercel.app",'https://skillbridgeclient-mainu0177-mainuddins-projects-943a859f.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
};

