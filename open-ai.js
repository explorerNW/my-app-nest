import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env['GITHUB_TOKEN'];
const endpoint = 'https://models.inference.ai.azure.com';
const modelName = 'gpt-4o-mini';

async function main() {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' },
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: modelName,
  });

  console.log(response.choices[0].message.content);
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
});
