import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const sendOtpSms = async (toPhone: string, code: string) => {
  try {
    const msg = await client.messages.create({
      body: `Your verification code is ${code}`,
      from: fromPhone,
      to: toPhone,
    });
    console.log("Sent OTP SMS:", msg.sid);
  } catch (err) {
    console.error("Error sending OTP SMS:", err);
    throw new Error("Failed to send OTP");
  }
};
