import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('your-database-name');

  switch (req.method) {
    case 'POST': // Register a new user
      try {
        const { name, email, password, phone } = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUser);
        res.status(201).json({ success: true, userId: result.insertedId });
      } catch (error) {
        console.error('User registration error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;

    case 'GET': // Get user details (you would typically protect this route)
      try {
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Exclude sensitive information
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      } catch (error) {
        console.error('Fetching user error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
