import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { imageName } = req.body;

      // Ensure the images directory exists
      const imagesPath = path.join(process.cwd(), 'public/images');
      fs.mkdirSync(imagesPath, { recursive: true });

      // Temporarily save the image
      const tempPath = path.join(imagesPath, imageName);
      const fileStream = req.pipe(fs.createWriteStream(tempPath));

      fileStream.on('finish', () => {
        res.status(200).json({
          imageUrl: `https://nkf448kn-3000.asse.devtunnels.ms/images/${imageName}`,
        });

        // Schedule deletion of the image
        setTimeout(() => fs.unlink(tempPath, (err) => console.error(err)), 30 * 1000);
      });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
