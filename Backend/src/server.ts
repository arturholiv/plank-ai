import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { enhanceCode } from './openAI';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://plankai.arturholiv.com.br/'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
dotenv.config();
const PORT = process.env.PORT || 8080;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});