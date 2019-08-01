function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sleepRandom(maxMs: number) {
  const randomMs = Math.floor(Math.random() * maxMs) + 1;
  return await sleep(randomMs);
}

export default sleep;
