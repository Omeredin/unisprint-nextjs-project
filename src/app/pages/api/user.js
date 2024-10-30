import axios from 'axios';
import { getSession } from 'next-auth/react'; // Or however you manage sessions

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // If the session exists, return user info
    res.status(200).json({ email: session.user.email, displayName: session.user.name });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
