import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { title, start, end, trainee, user, userid } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("Meetings");
    const collection = db.collection("events");

    await collection.insertOne({ title, start, end, trainee, user, userid });

    res.status(200).json({ message: "Answer inserted successfully" });
  } catch (error) {
    console.error("Error inserting answer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
