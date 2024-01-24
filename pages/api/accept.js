import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      const objectId = new ObjectId(id);

      const client = await clientPromise;
      const db = client.db("leave");

      const result = await db
        .collection("details")
        .updateOne({ _id: objectId }, { $set: { status: true } });

      if (result.modifiedCount === 1) {
        res
          .status(200)
          .json({ message: "Leave request accepted successfully!" });
      } else {
        res.status(400).json({ error: "Failed to accept leave request." });
      }
    } catch (error) {
      console.error("Error accepting leave request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
