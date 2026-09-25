import {INotificationProvider} from "../notification.interface";
import { initializeApp, cert, App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

export class FirebasePushNotificationProvider implements INotificationProvider {
    private client: App;

    constructor(config: any) {
        this.client = initializeApp({
            credential: cert(config),
        });
    }

    async send(token: string, data: { title: string; body: string }): Promise<void> {
        await getMessaging(this.client).send({
            token,
            notification: {
                title: data.title,
                body: data.body,
            },
        });
    }
}