import url from "url";
import { omit } from "lodash/object";
import http from "http";
import https from "https";

const defaultOptions = {
  //headers: {},
  //timeout: 0,
  forwardPath: req => url.parse(req.url).path
};

export default function streamingHttpProxy(host, _options = {}) {
  const parsedHost = url.parse(host);
  const options = {
    ...defaultOptions,
    ..._options
  };

  return (req, res, next) => {
    const forwardPath = options.forwardPath(req);
    const ishttps = parsedHost.protocol === "https:";

    const reqOptions = {
      method: req.method,
      hostname: parsedHost.hostname,
      port: parsedHost.port,
      path: forwardPath,
      headers: {
        ...omit(req.headers, ["host", "connection", "content-length"]),
        ...options.headers,
        connection: "close"
      }
    };

    const externalRequest = (ishttps
      ? https
      : http).request(reqOptions, response => {
      response.on("data", chunk => res.write(chunk));
      response.on("end", () => res.end());
      response.on("error", err => next(err));

      if (!res.headersSent) {
        res.status(response.statusCode);
        Object.keys(response.headers)
          .filter(item => item !== "transfer-encoding")
          .forEach(item => res.set(item, response.headers[item]));
      }
    });

    externalRequest.on("socket", socket => {
      options.timeout &&
        socket.setTimeout(options.timeout, () => externalRequest.abort());
    });

    externalRequest.on("error", err => {
      if (err.code === "ECONNRESET") {
        res.setHeader(
          "X-Timeout-Reason",
          `Timed out proxy request to ${host}${forwardPath} after ${options.timeout}ms.`
        );
        res.writeHead(504, { "content-type": "text/plain" });
        res.end();
      } else {
        next(err);
      }
    });

    if (req.body && req.body.length) {
      externalRequest.write(req.body);
    }

    externalRequest.end();

    req.on("aborted", () => externalRequest.abort());
  };
}
