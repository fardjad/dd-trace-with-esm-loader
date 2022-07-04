/**
 * Do not import this file manually!
 * This file is meant to be loaded on startup (i.e. by passing --require flag to node executable)
 */

const { tracer } = require("dd-trace");

tracer.init({
  flushInterval: 100,
});

const blocklist = [
  // do not trace the fake agent
  /^\/v(\d+\.?)+\/traces/i,
];

tracer.use("http", {
  blocklist,
  enabled: true,
});
