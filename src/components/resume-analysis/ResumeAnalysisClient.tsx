"use client";
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeResume } from '@/ai/flows/analyze-resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const formSchema = z.object({
  resume: z
    .any()
    .refine((files) => files?.length == 1, 'Resume is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'Only .pdf files are accepted.'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function ResumeAnalysisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);

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
    setResumeDataUri(null);

    try {
      const file = data.resume[0];
      const dataUri = await fileToDataUri(file);
      setResumeDataUri(dataUri);
      const result = await analyzeResume({ resumeDataUri: dataUri });
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

      {(isLoading || error) && (
        <CardFooter>
            {isLoading && (
                <div className="flex items-center text-muted-foreground w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Analyzing your resume... This might take a moment.</span>
                </div>
            )}
            {error && (
                <Alert variant="destructive" className="w-full">
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </CardFooter>
        )}
        
        {analysis && resumeDataUri && !isLoading && (
            <CardContent className="mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-bold font-headline mb-4">Your Resume</h2>
                        <div className="h-[600px] border rounded-lg">
                           <iframe src={resumeDataUri} width="100%" height="100%" title="Resume Preview"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2"><Wand2 size={20}/> Analysis Report</h2>
                        <ScrollArea className="h-[600px] border rounded-lg p-4 bg-secondary/30">
                            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                {analysis}
                            </ReactMarkdown>
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>
        )}
    </>
  );
}
