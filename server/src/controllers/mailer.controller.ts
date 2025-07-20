import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { catchErrors } from "../utils/CatchErrors";
import { Request, Response, NextFunction } from "express";

const nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, userEmail, text, subject } = req.body;

    var email = {
      body: {
        name: username,
        intro:
          text ||
          "Welcome to Mailgen! We're very excited to have you on board.",
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject || "Signup Successfully",
      html: emailBody,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return res
          .status(200)
          .send({ msg: "You should receive an email from us." });
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  }
);
