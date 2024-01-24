// api/leave/delete/[id].js
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      console.log("id to be deleted:", id);

      const objectId = new ObjectId(id);
      const client = await clientPromise;
      const db = client.db("leave");

      const result = await db
        .collection("details")
        .deleteOne({ _id: objectId });

      if (result.deletedCount === 1) {
        res
          .status(200)
          .json({ message: "Leave request deleted successfully!" });
      } else {
        res.status(400).json({ error: "Failed to delete leave request." });
      }
    } catch (error) {
      console.error("Error deleting leave request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
