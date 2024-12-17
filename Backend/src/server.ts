import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { enhanceCode } from './openAI';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://plankai.arturholiv.com.br', 'https://plankaiv2.arturholiv.com.br'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

dotenv.config();
const PORT = process.env.PORT || 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.post('/codeEnhancement', async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
  
    if (!code) {
      res.status(400).json({ error: "The field 'code' is required." });
      return;
    }
  
    try {
      const response = await enhanceCode(code);
      res.json({ result: response });
    } catch (error: any) {
      if (error.message) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred while enhancing the code." });
      }
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});