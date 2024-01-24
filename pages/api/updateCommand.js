import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('form');

      const { userid, command } = req.body;

      const result = await db.collection('members').updateOne(
        { _id: ObjectId(userid) },
        { $set: { command: command } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Command updated successfully!' });
      } else {
        res.status(400).json({ error: 'Failed to update command.' });
      }
    } catch (error) {
      console.error('Error updating command:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
