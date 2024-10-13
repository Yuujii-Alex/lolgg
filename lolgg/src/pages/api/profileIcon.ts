import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { profileIconId } = req.query;

  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${profileIconId}.png`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
}
