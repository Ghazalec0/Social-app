import {IMailProvider} from "../email.interface";
import nodemailer, {Transporter} from "nodemailer";


interface NodeMailerConfig {
  service: string,
  host: string,
  port: number,
  auth: {
    user: string,
    pass: string,
  },
}

// provider >> config >>

export class NodemailerProvider implements IMailProvider {

  private transporter: Transporter;

  constructor(config: NodeMailerConfig) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      host: config.host,
      port: config.port,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    })
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({to, subject, html});
  }
} 