export function nowMs(req?: Request): number {
  if (process.env.TEST_MODE === "1" && req) {
    const testNow = req.headers.get("x-test-now-ms");
    if (testNow) return parseInt(testNow, 10);
  }
  return Date.now();
}
