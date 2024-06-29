import nodemailer from 'nodemailer'

import  jwt  from 'jsonwebtoken'
import { html } from './user.email.html.js'

export const sendEmail =async(options)=>{
    let transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"safereturn10@gmail.com",
            pass:"lafd cgcx pvrw vuey"
        }
    })
    let token =jwt.sign({email:options.email},process.env.jwt_KEY )
    let info =await transporter.sendMail({
        from:'"Safe Return" <safereturn10@gmail.com>',
        to:options.email,
        subject:"Confirm Email",
        html:html(token)
    })
    console.log(info)
}

export const sendPassEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "safereturn10@gmail.com",
      pass: "lafd cgcx pvrw vuey",
    },
  });
  let info = await transporter.sendMail({
    from: '"Safe Return" <safereturn10@gmail.com>',
    to: options.email,
    subject: "Reset Password",
    html: `
    <p>Hello ${options.userName},</p>
     <p>Your password reset code is [${options.resetCode}]. Use it within one hour.</p>
    <p>Reach out to support for help, Regards.</p>`,
  });
};

export const sendNotifiEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "safereturn10@gmail.com",
      pass: "lafd cgcx pvrw vuey",
    },
  });
  let token = jwt.sign({ email: options.email }, process.env.jwt_KEY);
  let info = await transporter.sendMail({
    from: '"Safe Return" <safereturn10@gmail.com>',
    to: options.email,
    subject: "Welcome News",
    html: `
    <p>Hi there,</p>
    <p>We have found your child, <strong>${options.childName}</strong>. We will contact you as soon as possible using the information you provided in the form.</p>
    <p>Please stay tuned for our call to facilitate the communication process and ensure the safe return of your child.</p>`
  });
  console.log(info);
};
