// pages/api/mocklogin.js
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const dbName = 'test'; // Your database name
  const collectionName = 'users'; // Your collection name

  // Connect to MongoDB
  const db = await clientPromise.then(client => client.db(dbName));

  // Find the user in the database by email
  const user = await db.collection(collectionName).findOne({ email });
  console.log("user",user)

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check if the entered password matches the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);
  const type =user.type
  const name =user.name
  const id =user._id
  const mentor =user.mentor
  const trainee =user.trainee
  const survey=user.servey

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // For demonstration, you can send a response with the entered data
  res.status(200).json({ email, password,type,id,name,mentor,trainee,survey });
}
