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
  prompt: `You are an expert career consultant and resume writer. Analyze the provided resume against the given job description.

Your task is to:
1. Calculate an Applicant Tracking System (ATS) score representing the match between the resume and the job description. The score should be a whole number between 0 and 100.
2. Provide a detailed analysis report in Markdown format. The report should be written in simple, easy-to-understand language. It should highlight strengths, weaknesses, and areas for improvement, focusing on keywords, skills, and experience alignment with the job description.
3. Rewrite and optimize the entire resume to better align with the job description, incorporating your suggestions. Ensure the output is only the text of the updated resume.

Resume: {{media url=resumeDataUri}}
Job Description: {{{jobDescription}}}`,
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
