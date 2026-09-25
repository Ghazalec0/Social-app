import { FirebasePushNotificationProvider } from "./firebase.service";
import * as fs from "node:fs";
import path from "node:path";

const config: any = JSON.parse(
    fs.readFileSync(
        path.join(
            process.cwd(),
            "src",
            "config",
            "social-app-c45-g3-2f8e5-firebase-adminsdk-fbsvc-83073dd2ff.json"
        ),
        "utf-8"
    )
);

export const firebasePushNotificationProvider =
    new FirebasePushNotificationProvider(config);