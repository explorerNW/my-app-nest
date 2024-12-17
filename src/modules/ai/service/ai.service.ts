import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env['AI_TOKEN'];
const endpoint = 'https://models.inference.ai.azure.com';
const modelName = 'gpt-4o-mini';

@Injectable()
export class AiService {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({ baseURL: endpoint, apiKey: token });
  }

  async prompt(content: string) {
    return await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    });
  }
}
