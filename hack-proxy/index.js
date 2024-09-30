import fs from "fs";
import cors from "cors";
import http from "http";
import httpProxy from "http-proxy";

const sandboxEntry = httpProxy.createProxyServer({});

const server = http.createServer(function (req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  if (req.url.startsWith("/benerail")) {
    req.url = req.url.replace("/benerail", "/osdm-facade");
    sandboxEntry.web(req, res, {
      target: "http://127.0.0.1:8009/",
    });
  } else if (req.url.startsWith("/sqills")) {
    req.url = req.url.replace("/sqills", "/");
    sandboxEntry.web(req, res, {
      target: "http://127.0.0.1:8010/",
    });
  } else if (req.url.startsWith("/bileto")) {
    req.url = req.url.replace("/bileto", "/api");
    sandboxEntry.web(req, res, {
      target: "http://127.0.0.1:8011/",
    });
  } else {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.write(`Service ${req.url} unknown`);
    res.end();
  }
});

server.listen(5050);

/// BENERAIL OSDM Sandbox Proxy

const benerailProxy = httpProxy
  .createProxyServer({
    target: {
      protocol: "https:",
      host: "benerail-stg-apim.azure-api.net",
      port: 443,
      pfx: fs.readFileSync("./.secrets/client-cert.pfx"),
    },
    changeOrigin: true,
  })
  .listen(8009);

benerailProxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.setHeader(
    "Ocp-Apim-Subscription-Key",
    process.env.BENRAIL_OCP_APIM_SUBSCRIPTION_KEY
  );
  proxyReq.setHeader("Requestor", process.env.REQUESTOR);
  proxyReq.removeHeader("Origin");
});

benerailProxy.on("proxyRes", (proxyRes, req, res) => {
  cors()(req, res, () => {});
});

/// SQILLS OSDM Sandbox Proxy
var sqillsJWT = "";

// Get new JWT token
const getJWT = async () => {
  console.log("Renewing Sqills token");

  const response = await fetch(
    "https://api.sqills-osdm-test.cloud.sqills.com/oauth/v2/token",
    {
      method: "POST",
      body: JSON.stringify({
        grant_type: "https://com.sqills.s3.oauth.agent",
        username: process.env.SQILLS_USERNAME,
        password: process.env.SQILLS_PASSWORD,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.SQILLS_AUTH_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data.access_token;
};

getJWT().then((newToken) => {
  sqillsJWT = newToken;
  console.log("Sqills token setup");
});

const sqillsProxy = httpProxy
  .createProxyServer({
    target: {
      protocol: "https:",
      host: "sqills-osdm-test.osdm-s3-adapter.s3p.cloud",
      port: 443,
    },
    changeOrigin: true,
  })
  .listen(8010);

sqillsProxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.setHeader("Authorization", `Bearer ${sqillsJWT}`);
});

sqillsProxy.on("proxyRes", (proxyRes, req, res) => {
  cors()(req, res, () => {});
});

/// Bileto OSDM Sandbox Proxy
var biletoJWT = "";

// Get new JWT token
const getBiletoJWT = async () => {
  console.log("Renewing Bileto token");

  const response = await fetch(
    `https://osdm-5.platform.bileto.zone/api/oauth/token?grant_type=client_credentials&client_id=${process.env.BILETO_CLIENT_ID}&client_secret=${process.env.BILETO_CLIENT_SECRET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.access_token;
};

getBiletoJWT().then((newToken) => {
  biletoJWT = newToken;
  console.log("Bileto token setup");
});

const biletoProxy = httpProxy
  .createProxyServer({
    target: {
      protocol: "https:",
      host: "osdm-5.platform.bileto.zone",
      port: 443,
    },
    changeOrigin: true,
  })
  .listen(8011);

biletoProxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.setHeader("Authorization", `Bearer ${biletoJWT}`);
  proxyReq.setHeader("Requestor", process.env.REQUESTOR);
});

biletoProxy.on("proxyRes", (proxyRes, req, res) => {
  cors()(req, res, () => {});
});

console.log("Proxy server listening on port 5050");
