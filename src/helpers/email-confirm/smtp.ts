import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { apiPort, portalUrl, smtpConfig } from '../../config';
import { getConfirmTemplate } from './templates';


export class EmailWorker {

  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      // {
      // 	sendmail: true,
      // 	newline: 'unix',
      // 	path: '/usr/sbin/sendmail'
      // }
      smtpConfig
    );
  }
  

  async sendEmail(email, u, c) {
   
    const link = `http://${portalUrl}:${apiPort}/api/users/confirmRegistration?u=${u}&c=${c}`;
console.log(link);
    const emailHtml = getConfirmTemplate(link);
    console.log(emailHtml);

    await this.transporter.sendMail({
      from: smtpConfig.auth.user,
      to: email,
      subject: 'Подтверждение регистрации ',
      html: emailHtml,
    });
  }

  async sendNotification(email, title, body) {
    await this.transporter.sendMail({
      from: smtpConfig.auth.user,
      to: email,
      subject: title,
      html: body,
    });
  }
}