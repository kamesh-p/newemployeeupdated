import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { newEvent, user, mentor, status, type } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("leave");
    const collection = db.collection("details");

    await collection.insertOne({ newEvent, user, mentor, status, type });

    res.status(200).json({ message: "leave is succesfully submitted" });
  } catch (error) {
    console.error("Error inserting Leave:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
