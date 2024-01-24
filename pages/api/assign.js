import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("projects");
      const otherDb = client.db("questions");

      const { selectedTrainee, id, title } = req.body;

      // Update assist field
      const updateResult = await db
        .collection("details")
        .updateOne(
          { "projects.id": id },
          { $set: { "projects.$.assist": selectedTrainee } }
        );

      if (updateResult.modifiedCount === 1) {
        res.status(200).json({ message: "Assist field updated successfully!" });

        const deleteResult = await otherDb
          .collection("project")
          .deleteOne({ title: title });

        if (deleteResult.deletedCount === 1) {
          console.log("Project document deleted successfully.");
        } else {
          console.error("Failed to delete project document.");
        }
      } else {
        res.status(400).json({ error: "Failed to update assist field." });
      }
    } catch (error) {
      console.error("Error updating assist field:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
