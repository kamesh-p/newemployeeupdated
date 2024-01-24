import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { timesheetId } = req.body;

      if (!timesheetId) {
        return res.status(400).json({ error: "Timesheet ID is required." });
      }

      const objectId = new ObjectId(timesheetId);
      const client = await clientPromise;
      const db = client.db("Timesheet");

      const result = await db
        .collection("details")
        .updateOne({ _id: objectId }, { $set: { status: true } });

      if (result.modifiedCount === 1) {
        return res.status(200).json({
          message: "Timesheet request accepted successfully!",
        });
      } else {
        return res
          .status(400)
          .json({ error: "Failed to accept timesheet request." });
      }
    } catch (error) {
      console.error("Error accepting timesheet request:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
