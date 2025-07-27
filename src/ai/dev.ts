import { config } from 'dotenv';
config();

import '@/ai/flows/match-jobs.ts';
import '@/ai/flows/analyze-resume.ts';
import '@/ai/flows/generate-updated-resume.ts';
