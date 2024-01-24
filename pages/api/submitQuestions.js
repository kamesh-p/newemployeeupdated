// pages/api/new-forms.ts
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const formClient = await clientPromise;
      const formDb = formClient.db("questions");

      const { questions, user, trainee ,title } = req.body;

      console.log("Received form data:", questions);

      // Create a document object
      const formData = {
        questions,
        user,
        trainee,
        title
      };

      // Insert the form data into the "project" collection in the form database
      await formDb.collection("project").insertOne(formData);

      res.status(201).json({ message: "Form submitted successfully!" });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
