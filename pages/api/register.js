import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../../env";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, password, type, servey, trainee, mentor } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("test");
    const hashedPassword = await bcrypt.hash(password, 10);
    const collection = db.collection("users");

    await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      type,
      servey,
      trainee,
      mentor,
    });

    // Send welcome email
    await sendEmail(email, password, name, type, trainee);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function sendEmail(email, password, name, type) {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  // Additional text in the email
  const additionalText = `
      Dear ${name},
  
      We are pleased to welcome you to our company! As part of your onboarding process,
      please find below the details of your offer:
  
      Role: ${type}
  
      Your password is: ${password}
  
      Best regards,
      Perficient
    `;
  //     ${type === "teamlead" ? "Trainee" : "Mentor"}: ${
  //   type === "teamlead" ? trainee : "Not assigned"
  // }

  const mailOptions = {
    from: "kkamesh4790@gmail.com", // replace with your email
    to: email,
    subject: `Welcome ${name}`,
    text: additionalText,
  };

  await transporter.sendMail(mailOptions);
}
