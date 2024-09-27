const fs = require("fs");
var cors = require("cors");

var http = require("http"),
  httpProxy = require("http-proxy");

var sandboxEntry = httpProxy.createProxyServer({});

var server = http.createServer(function (req, res) {
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
    req.url = req.url.replace("/bileto", "/");
    res.writeHead(501, { "Content-Type": "text/plain" });
    res.write("Bileto connection not implemented");
    res.end();
  } else {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.write(`Service ${req.url} unknown`);
    res.end();
  }
});

server.listen(5050);

// BENERAIL OSDM Sandbox Proxy
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
  proxyReq.setHeader("Requestor", process.env.BENERAIL_REQUESTOR);
  proxyReq.removeHeader("Origin");
});

benerailProxy.on("proxyRes", (proxyRes, req, res) => {
  cors()(req, res, () => {});
});

// SQILLS OSDM Sandbox Proxy

let sqillsJWT = "";
// Get new JWT token

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
  proxyReq.setHeader("Authorization", `Basic ${sqillsJWT}`);
});

sqillsProxy.on("proxyRes", (proxyRes, req, res) => {
  cors()(req, res, () => {});
});

console.log("Proxy server listening on port 5050");
