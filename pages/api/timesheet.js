import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { Timesheet, user, mentor, userid, hours, status } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("Timesheet");
    const collection = db.collection("details");

    await collection.insertOne({
      Timesheet,
      user,
      mentor,
      userid,
      hours,
      status,
    });

    res.status(200).json({ message: "Timesheet is successfully submitted" });
  } catch (error) {
    console.error("Error inserting Timesheet:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
