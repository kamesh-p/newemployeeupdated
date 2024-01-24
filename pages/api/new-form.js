import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const formDb = client.db('form');
      const testDb = client.db('test');

      const formDataWithUserId = req.body;
      const userId = formDataWithUserId.userId;

      const testUserCollection = testDb.collection('users');
      await testUserCollection.updateOne(
        { _id: ObjectId(userId) },
        { $set: { servey: true } }
      );

      await formDb.collection('members').insertOne(formDataWithUserId);

      res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
