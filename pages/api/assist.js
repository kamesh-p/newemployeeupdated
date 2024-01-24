import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../../env";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { assistemail, title } = req.body;
  console.log("assist", title);

  // Create a Nodemailer transporter using your email service details
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: EMAIL,
    to: assistemail,
    subject: "Assignment Reminder: Project Trainee Allocation",
    text: `Dear Project Assistant,

This email serves as a reminder that you have been assigned to the project "${title}". Please coordinate with your mentor and actively participate in the project.

Thank you for your commitment.

Yours faithfully,
Perficient
`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    console.log("Email sent:", info.response);
    return res.status(200).json({ message: "Email sent successfully" });
  });
}
