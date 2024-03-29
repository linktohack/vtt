import express, { Request, Response } from "express";
import axios from "axios";

const cors = require("cors");

const srt2vtt = require("srt-to-vtt");
const ass2vtt = require("ass-to-vtt");

const abab = require("abab");
const https = require("https");

const app = express();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const handlerFor = (transformer: Function) => (req: Request, res: Response) => {
  (async () => {
    res.setHeader("Content-Type", "text/vtt");
    const url = abab.atob(req.query.hash);
    if (typeof url !== "string") {
      res.end("WEBTT FILE\n\n1\n0 --> 10\nError: invalid url}");
      return;
    }
    const res2 = await axios(url, { httpsAgent, responseType: "stream" });
    res2.data.pipe(transformer()).pipe(res);
  })().catch((e) => {
    res.end(
      `WEBTT FILE\n\n1\n0 --> 10\nError: ${(e && e.message) || "unknown"}`
    );
  });
};

app.use(cors());

app.get("/", function (req, res) {
  res.end(
    [
      "Convert and set the correct vtt mime type for srt and ass (and vtt)",
      "\t/srt?hash=:hash",
      "\t/ass?hash=:hash",
      "\t/vtt?hash=:hash",
      "where `:hash` is `btoa(url)`",
      "https://github.com/linktohack/vtt",
    ].join("\n")
  );
});

app.get("/srt", handlerFor(srt2vtt));

app.get("/ass", handlerFor(ass2vtt));

app.get(
  "/vtt",
  handlerFor((it: unknown) => it)
);

app.listen(process.env.PORT || 8000, function () {
  console.log(`Server listening on port ${process.env.PORT || 8000}!`);
});
