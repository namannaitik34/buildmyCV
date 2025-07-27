// src/ai/flows/match-jobs.ts
'use server';
/**
 * @fileOverview A flow to provide tailored resume optimization suggestions based on a job description.
 *
 * - matchJobs - A function that takes a job description and returns resume optimization suggestions.
 * - MatchJobsInput - The input type for the matchJobs function.
 * - MatchJobsOutput - The return type for the matchJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchJobsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to match the resume against.'),
  resumeText: z.string().describe('The text content of the resume.'),
});
export type MatchJobsInput = z.infer<typeof MatchJobsInputSchema>;

const MatchJobsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to optimize the resume.'),
  updatedResume: z.string().describe('The full text of the optimized resume.'),
});
export type MatchJobsOutput = z.infer<typeof MatchJobsOutputSchema>;

export async function matchJobs(input: MatchJobsInput): Promise<MatchJobsOutput> {
  return matchJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchJobsPrompt',
  input: {schema: MatchJobsInputSchema},
  output: {schema: MatchJobsOutputSchema},
  prompt: `As an expert resume consultant, given a job description and a resume, do the following:
1. Provide at least 3 specific, actionable suggestions to improve the resume.
2. Rewrite the entire resume, incorporating the suggestions to tailor it for the job description.

Job Description:
{{{jobDescription}}}

Resume:
{{{resumeText}}}
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const matchJobsFlow = ai.defineFlow(
  {
    name: 'matchJobsFlow',
    inputSchema: MatchJobsInputSchema,
    outputSchema: MatchJobsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
