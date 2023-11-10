import { OpenAI } from 'openai';
require('dotenv').config();

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default openAi;
