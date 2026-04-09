import app from './app';
import { envConfig } from './config/env';


const PORT  = process.env.PORT

async function main() {
  try {
    if (process.env.NODE_ENV !== "production") {
      app.listen(envConfig.PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.log(err);
  }
}

main();
