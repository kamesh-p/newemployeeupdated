import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../../env";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { mentoremail, title } = req.body;
  console.log("mentor", title);

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
    to: mentoremail,
    subject: "Assign an member for your project",
    text: `this mail is a remainder that you have not assigned a trainee for your allocated project  ${title} kindle aloocated it.
    yours faithfully,
    perficient
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
