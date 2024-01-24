// pages/api/updateSurvey.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { questions } = req.body;

    try {
      const client = await clientPromise;
      const databaseName = "question";
      const collectionName = "survey";
      const database = client.db(databaseName);
      const collection = database.collection(collectionName);

      // Fetch the existing questions from the database
      const existingQuestions = await collection.find({}).toArray();

      // Combine existing questions with the new questions
      const updatedQuestions = [...existingQuestions, ...questions];

      // Update the MongoDB collection with the combined list
      await collection.deleteMany({});
      const result = await collection.insertMany(updatedQuestions);

      res
        .status(201)
        .json({
          message: `Successfully updated ${result.insertedCount} questions in the database.`,
        });
    } catch (error) {
      console.error("Error updating questions in the database:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
