// src/ai/flows/generate-updated-resume.ts
'use server';
/**
 * @fileOverview An AI flow to generate an updated resume based on analysis and a job description.
 *
 * - generateUpdatedResume - A function that takes a resume and job description and returns an ATS score, analysis, and an updated resume.
 * - GenerateUpdatedResumeInput - The input type for the generateUpdatedResume function.
 * - GenerateUpdatedResumeOutput - The return type for the generateUpdatedResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUpdatedResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z
    .string()
    .describe('The job description to match the resume against.'),
});
export type GenerateUpdatedResumeInput = z.infer<typeof GenerateUpdatedResumeInputSchema>;

const GenerateUpdatedResumeOutputSchema = z.object({
  atsScore: z.number().describe('The calculated Applicant Tracking System (ATS) score from 0 to 100.'),
  analysisReport: z.string().describe('The AI-powered analysis report of the resume formatted in markdown.'),
  updatedResume: z.string().describe('The full text of the optimized resume.'),
});
export type GenerateUpdatedResumeOutput = z.infer<typeof GenerateUpdatedResumeOutputSchema>;

export async function generateUpdatedResume(input: GenerateUpdatedResumeInput): Promise<GenerateUpdatedResumeOutput> {
  return generateUpdatedResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUpdatedResumePrompt',
  input: {schema: GenerateUpdatedResumeInputSchema},
  output: {schema: GenerateUpdatedResumeOutputSchema},
  prompt: `As an expert resume writer, analyze the resume against the job description.
1.  Calculate an ATS score (0-100).
2.  Provide a detailed analysis report in simple Markdown, highlighting strengths and areas for improvement.
3.  Rewrite the resume to align with the job description.

Resume: {{media url=resumeDataUri}}
Job Description: {{{jobDescription}}}`,
  config: {
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

const generateUpdatedResumeFlow = ai.defineFlow(
  {
    name: 'generateUpdatedResumeFlow',
    inputSchema: GenerateUpdatedResumeInputSchema,
    outputSchema: GenerateUpdatedResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
