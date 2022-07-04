import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import enableDestroy from "server-destroy";

const defer = <T>() => {
  let resolve: (value?: unknown) => void;
  let reject: (value?: unknown) => void;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  Object.assign(promise, { resolve, reject });

  return promise as Promise<T> & {
    resolve: typeof resolve;
    reject: typeof reject;
  };
};

const listenServer = (server: http.Server, ...args: any[]) => {
  const deferrable = defer();
  server.listen(...args, () => {
    deferrable.resolve();
  });
  return deferrable;
};

const destroyServer = (server: http.Server) => {
  const deferrable = defer();
  server.destroy(() => {
    deferrable.resolve();
  });
  return deferrable;
};

const traceDeferrable = defer();
const fakeDatadogAgent = http.createServer(async (req, res) => {
  traceDeferrable.resolve();
  res.end();
});
enableDestroy(fakeDatadogAgent);

const server = http.createServer(async (_req, res) => {
  res.end("OK");
});
enableDestroy(server);

test("Send a trace to the agent upon receiving a request", async () => {
  await listenServer(fakeDatadogAgent, 8126);
  await listenServer(server, 3000);

  const response = await fetch("http://127.0.0.1:3000");
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.equal(text, "OK");

  await traceDeferrable;

  await destroyServer(server);
  await destroyServer(fakeDatadogAgent);
});
