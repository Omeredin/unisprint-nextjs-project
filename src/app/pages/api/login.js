import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      } 
      // Make a request to your authentication server
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      
      // If login is successful, send the token back to the client
      res.status(200).json({ token: response.data.token });
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}