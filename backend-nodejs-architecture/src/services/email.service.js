"use strict";

const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");
const { NotFoundError } = require("../utils/apiError");
const { replacePlaceholder } = require("../utils/helpers");
const transport = require("../db/init.nodemailer");

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = "Xác nhận Email đăng ký!",
  text = "xác nhận..",
}) => {
  try {
    const mailOptions = {
      from: '"ShopDEV" <anonymstick@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };

    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }

      console.log("Message sent:", info.messageId);
    });
  } catch (error) {
    console.error("error send Email::", error);
    return error;
  }
};

const sendEmailToken = async ({ email = null }) => {
  try {
    // 1. get Token
    const token = await newOtp({ email });

    // 2. get Template
    const template = await getTemplate({
      tem_name: "HTML EMAIL TOKEN",
    });

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    // 3. replace placeholder with params
    const content = replacePlaceholder(template.tem_html, {
      link_verify: `http://localhost:3056/v1/api/user/welcome-back?token=${token.otp_token}`,
    });

    // 4. send email
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: "Vui lòng xác nhận địa chỉ Email đăng ký ShopDEV.com!",
    }).catch(console.error);

    return 1;
  } catch (error) {
    // Handle the error (you may want to log or throw it)
    console.error(error);
  }
};

module.exports = {
  sendEmailToken,
};
