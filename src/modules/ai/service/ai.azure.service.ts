import { Injectable } from '@nestjs/common';
import { AzureOpenAI } from 'openai';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AZureOpenAiService {
  client: AzureOpenAI;
  constructor() {
    this.client = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiKey: process.env.AZURE_OPENAI_KEY,
      deployment: process.env.DEPLOYMENTID,
      apiVersion: '2024-11-01-preview',
    });
  }

  async ask(content: string) {
    const completions = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content },
      ],
      model: 'gpt-4o-mini',
    });

    return completions;
  }
}
