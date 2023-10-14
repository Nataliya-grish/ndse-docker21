const express = require("express");
const redis = require("redis");

const app = express();

const REDIS_URL = process.env.REDIS_URL || "localhost";
const COUNTER_URL = process.env.COUNTER_URL || 3001;

const client = redis.createClient({ url: REDIS_URL });
(async () => {
  await client.connect();
})();

app.get("/counter/:id", async (req, res) => {
  const { id } = req.params;
  const cnt = await client.get(id);
  res.status(200).json({ count: cnt });
});

app.post("/counter/:id/incr", async (req, res) => {
  const { id } = req.params;
  await client.incr(id);
});

app.listen(COUNTER_URL, () => {
  console.log("Counter app is listening on port  http://localhost:3001");
});
