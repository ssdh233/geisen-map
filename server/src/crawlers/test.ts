import timeout from "../utils/timeout";
import sleep from "../utils/sleep";

async function start() {
  try {
    let a = await timeout(4000, sleep(5000));
    console.log(a);
  } catch (e) {
    console.log(e);
  }
}

start();
