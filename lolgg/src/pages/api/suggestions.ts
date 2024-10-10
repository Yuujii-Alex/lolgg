import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  try {
    const response = await fetch(
      `https://your-api-url.com/summoner/suggestions?name=${name}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY || '', 
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}
