"use client";
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeResume } from '@/ai/flows/analyze-resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const formSchema = z.object({
  resume: z
    .any()
    .refine((files) => files?.length == 1, 'Resume is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .doc, and .docx files are accepted.'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function ResumeAnalysisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const file = data.resume[0];
      const resumeDataUri = await fileToDataUri(file);
      const result = await analyzeResume({ resumeDataUri });
      setAnalysis(result.analysisReport);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume File</Label>
            <Input id="resume" type="file" {...register('resume')} />
            {errors.resume && (
              <p className="text-sm text-destructive">{errors.resume.message as string}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze Now
          </Button>
        </form>
      </CardContent>

      {(isLoading || analysis || error) && (
        <CardFooter className="flex flex-col items-start space-y-4">
          {isLoading && (
            <div className="flex items-center text-muted-foreground w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Analyzing your resume... This might take a moment.</span>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {analysis && (
            <Card className="w-full bg-secondary/50">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Wand2/> Analysis Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{analysis}</div>
                </CardContent>
            </Card>
          )}
        </CardFooter>
      )}
    </>
  );
}