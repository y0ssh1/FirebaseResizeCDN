import * as functions from "firebase-functions";
import * as sharp from "sharp";
import * as os from "os";
import * as path from "path";
import * as fileType from "file-type";
import { storage } from "./firebaseAdmin";

// CloudFunction fired by http event must be located us-central1.
// ref https://firebase.google.com/docs/functions/locations#http_and_client_callable_functions
const region = "us-central1";
const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: "1GB",
};
// default width (height scales keeping aspect ratio)
const defaultWidth = 800;

export const onRequestResizedImage = functions
  .runWith(runtimeOpts)
  .region(region)
  .https.onRequest((req, res) => {
    const filePath = req.path.substr(1);
    const size = req.query.size as string;
    const cropType = req.query.crop as string;
    let width: number | undefined;
    let height: number | undefined;
    let sharpOption: sharp.OverlayOptions;
    if (typeof size === "undefined") {
      width = defaultWidth;
      height = undefined;
    } else {
      const [_width, _height] = size.split("x");
      width = _width ? Number(_width) : undefined;
      height = _height ? Number(_height) : undefined;
    }
    if (cropType === "circle") {
      let radius: number | undefined;
      if (width && height) {
        radius = width > height ? height / 2 : width / 2;
      } else if (width) {
        radius = width / 2;
      } else if (height) {
        radius = height / 2;
      }
      sharpOption = {
        input: Buffer.from(`<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`),
        blend: "dest-in",
      };
    }
    const bucket = storage.bucket(functions.config().storage.bucket);
    const tempFilePath = path.join(os.tmpdir(), `${Math.round(Math.random() * 10000)}`);
    bucket
      .file(filePath)
      .download({
        destination: tempFilePath,
      })
      .then(() => {
        sharp(tempFilePath)
          .rotate()
          .resize(width, height)
          .composite([sharpOption])
          .toBuffer()
          .then(data => {
            const type = fileType(data);
            res.set("Cache-Control", `public, max-age=${86400 * 365}`);
            res.set("Content-Type", type ? type.mime : "image/jpeg");
            res.status(200).send(data);
          })
          .catch((err: Error) => res.status(500).send(err));
      })
      .catch((err: Error) => {
        res.status(500).send(err);
      });
  });
