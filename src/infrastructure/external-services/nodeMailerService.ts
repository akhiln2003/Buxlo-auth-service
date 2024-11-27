import { IemailService } from "../../application/interfaces/IemailService";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


export class NodeMailerService implements IemailService {
    private readonly transporter;
    constructor(){        
        if (!process.env.EMAIL_USER ) {
            throw new Error("process.env.EMAIL_USER is not getting")
        }
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER ,
                pass: process.env.EMAIL_PASS 
            }
        })
    }

    async sendMail(to: string, subject: string, body: string ,): Promise<void> {
        const mailOptions = {
            from: "buxlofinance@gmail.com",
            to,
            subject,
            html:body,
        }
        await this.transporter.sendMail(mailOptions)
    }
}