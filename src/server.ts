import app from './app';
import { envConfig } from './config/env';
import { applyMiddleware } from './middlewares';


const PORT  = process.env.PORT

async function main() {
  try {
    applyMiddleware(app)
    if (process.env.NODE_ENV !== "production") {
      app.listen(envConfig.PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Error initializing app: ', error)
    process.exit(1);
  }
}

main();
