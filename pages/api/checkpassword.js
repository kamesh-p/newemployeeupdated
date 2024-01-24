import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { userid, checkPassword, newpassword } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("test");
    const objectId = new ObjectId(userid);
    console.log("new", newpassword);

    const user = await db.collection("users").findOne({ _id: objectId });
    console.log("user", user.password);
    const isPasswordMatch = await bcrypt.compare(checkPassword, user.password);
    if (isPasswordMatch) {
      const hashedNewPassword = await bcrypt.hash(newpassword, 10);

      await db.collection("users").updateOne(
        { _id: objectId },
        {
          $set: {
            password: hashedNewPassword,
          },
        }
      );
      console.log("correct password", newpassword);
      return res.status(200).json({ message: "User found", user });
    } else {
      console.log("incoorect password");
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error finding user:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
