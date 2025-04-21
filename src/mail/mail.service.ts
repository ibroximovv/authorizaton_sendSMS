import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'islomaka2323@gmail.com',
            pass: 'grtf zyfb vtxr kcdw'
        }
    })

    async sendSmsToEmail(email: string, subject: string, text: string, html?: string) {
        try {
            await this.transporter.sendMail({
                to: email,
                subject: subject,
                text: text,
                html: html
            })
            return { message: 'successfully sendSMS'}
        } catch (error) {
            throw new InternalServerErrorException('SendSMS error')
        }
    }
}
