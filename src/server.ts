import app from './app';
import { envConfig } from './config/env';


const PORT  = process.env.PORT

async function main() {
  try {
    app.listen(envConfig.PORT, () => {
      console.log(`Example app listening on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
