import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
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
        .deleteOne({ _id: objectId });

      if (result.deletedCount === 1) {
        return res.status(200).json({
          message: "Timesheet deleted successfully!",
        });
      } else {
        return res.status(400).json({ error: "Failed to delete timesheet." });
      }
    } catch (error) {
      console.error("Error deleting timesheet:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
