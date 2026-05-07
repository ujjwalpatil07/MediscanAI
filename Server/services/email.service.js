import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";

dotenv.config();

const serviceId = process.env.EMAILJS_SERVICE_ID;
const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;

emailjs.init({
  publicKey,
  privateKey,
});

export const sendEmailService = async (templateId, templateParams) => {
  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.text || error?.message,
    };
  }
};
