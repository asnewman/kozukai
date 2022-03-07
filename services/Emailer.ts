import nodemailer from "nodemailer";

class Emailer {
    static async sendPasswordReset(email: string, resetCode: string) {
        const transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Kozukai Habit" <ash@kozukaihabit.com>', // sender address
            to: email,
            subject: "Password reset", // Subject line
            text: `Password reset code is ${resetCode}. Reset email at https://www.kozukaihabit.com/password-change.`
        });
    }
}

export default Emailer