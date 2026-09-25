export interface INotificationProvider {
    /*
    @params token: ex:FCM token in case firebase service
    @params data: object contain push notification data
     */
    send(token: string, data: { title: string, body: string }): Promise<void>;
}