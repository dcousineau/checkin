import express from "express";
import path from "path";
import fetch from "isomorphic-fetch";
import fs from "fs";

import streamingHttpProxy from "../middleware/streaming-http-proxy";

const localAssetManifest = path.resolve(
  `${__dirname}/../../../build/static/assets.json`
);

function loadAssetManifestLocal() {
  return cb =>
    fs.readFile(localAssetManifest, (err, data) => {
      if (err) {
        cb(err);
      }
      cb(null, JSON.parse(data));
    });
}

function loadAssetManifestProxy() {
  return cb =>
    fetch("http://localhost:3001/static/assets.json")
      .then(response => response.json())
      .then(response => cb(null, response))
      .catch(err => cb(err));
}

export default app => {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DISABLE_PROXY !== "true"
  ) {
    app.use(
      /(^\/static|hot-update)/i,
      streamingHttpProxy("http://127.0.0.1:3001", {
        forwardPath: req => req.originalUrl
      })
    );
  }

  //@TODO: point to built static path...
  app.use("/static", express.static(`${__dirname}/../../../build/static/`));

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DISABLE_PROXY !== "true"
  ) {
    app.locals.loadAssetManifest = loadAssetManifestProxy();
  } else {
    app.locals.loadAssetManifest = loadAssetManifestLocal();
  }
};
