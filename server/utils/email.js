// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

// dotenv.config();


// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("SMTP Error:", error);
//   } else {
//     console.log("Brevo SMTP Ready",process.env.EMAIL_PASS,process.env.EMAIL_USER);
//   }
// });


// //     const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false,
// //   requireTLS: true,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// //   connectionTimeout: 30000,
// //   greetingTimeout: 30000,
// // });


// const sendBookingEmail = async (userEmail, userName, eventTitle) => {
//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject: `Booking Confirmed: ${eventTitle}`,
//             html: `
//         <h2>Hi ${userName}!</h2>
//         <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
//         <p>Thank you for choosing Eventora.</p>
//       `
//         };
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully to', userEmail);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// const sendOTPEmail = async (userEmail, otp, type) => {
//     try {
//         const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
//         const msg = type === 'account_verification'
//             ? 'Please use the following OTP to verify your new Eventora account.'
//             : 'Please use the following OTP to verify and confirm your event booking.';

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject: title,
//             html: `
//                 <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
//                     <h2 style="color: #111;">${title}</h2>
//                     <p style="color: #555; font-size: 16px;">${msg}</p>
//                     <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
//                         ${otp}
//                     </div>
//                     <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
//                 </div>
//             `
//         };
//         await transporter.sendMail(mailOptions);
//         console.log(`OTP sent to ${userEmail} for ${type}`);
//     } catch (error) {
//         console.error('Error sending OTP email:', error);
//     }
// };

// module.exports = { sendBookingEmail, sendOTPEmail };


const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const payload = {
            sender: { 
                name: "Eventora", 
                email: process.env.VERIFIED_SENDER_EMAIL 
            },
            to: [{ email: userEmail }],
            subject: `Booking Confirmed: ${eventTitle}`,
            htmlContent: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `
        };

        await axios.post(BREVO_API_URL, payload, {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            }
        });
        
        console.log('✅ Booking Email sent via Brevo API to', userEmail);
    } catch (error) {
        console.error('❌ API Error (Booking):', error.response ? error.response.data : error.message);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const payload = {
            sender: { 
                name: "Eventora", 
                email: process.env.VERIFIED_SENDER_EMAIL 
            },
            to: [{ email: userEmail }],
            subject: title,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await axios.post(BREVO_API_URL, payload, {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            }
        });

        console.log(`✅ API OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('❌ API Error (OTP):', error.response ? error.response.data : error.message);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
