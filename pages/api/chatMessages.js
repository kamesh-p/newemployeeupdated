import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { chatMessages, sendid, receiveid, timestamp } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("chat");
    const collection = db.collection("messages");

    await collection.insertOne({ chatMessages, sendid, receiveid, timestamp });

    res.status(200).json({ message: "Answer inserted successfully" });
  } catch (error) {
    console.error("Error inserting answer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
