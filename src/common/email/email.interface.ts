// provider >> send mail
export interface IMailProvider {
  send(to: string, subject: string, html: string): Promise<void>
}