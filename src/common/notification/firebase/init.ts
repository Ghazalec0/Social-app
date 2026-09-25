import { FirebasePushNotificationProvider } from "./firebase.service";
import * as fs from "node:fs";
import path from "node:path";

let config: any;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  config = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  config = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src", "config", "social-app-c45-g3-2f8e5-firebase-adminsdk-fbsvc-83073dd2ff.json"),
      "utf-8"
    )
  );
}

export const firebasePushNotificationProvider = new FirebasePushNotificationProvider(config);