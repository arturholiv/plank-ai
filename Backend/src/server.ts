import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { enhanceCode } from './openAI';
const app = express();

app.use(express.json());

dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.post('/codeEnhancement', async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
  
    if (!code) {
      res.status(400).send({ error: "the field 'code' is required." });
      return;
    }
  
    try {
      const response = await enhanceCode(code);
      res.send({ result: response });
    } catch (error: any) {
      console.error("Error processing code:", error.message);
      res.status(500).send({ error: "Error enhancing code." });
    }
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});