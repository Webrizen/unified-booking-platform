import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD_GAPP,
  },
});

export const mailOptions = {
  from: process.env.SENDER_EMAIL,
};
