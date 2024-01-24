// // pages/api/userSearch.js

// import clientPromise from "../../lib/mongodb";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).end();
//   }

//   const { term } = req.body;

//   if (!term) {
//     return res.status(400).json({ error: "Search term is required." });
//   }

//   let client;

//   try {
//     client = await clientPromise;
//     const db = client.db("test");
//     const collection = db.collection("users");

//     // Simulate searching for users in the database based on the search term
//     const searchResults = await collection.find({ name: term }).toArray();

//     res.json(searchResults);
//   } catch (error) {
//     console.error("Error searching users:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     try {
//       if (client) {
//         await client.close();
//       }
//     } catch (closeError) {
//       console.error("Error closing MongoDB client:", closeError.message);
//     }
//   }
// }
