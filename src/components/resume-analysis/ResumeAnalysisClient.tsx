"use client";
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateUpdatedResume } from '@/ai/flows/generate-updated-resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fileToDataUri } from '@/lib/file-utils';
import { Textarea } from '../ui/textarea';
import { ATSScoreGauge } from '../dashboard/ATSScoreGauge';

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
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

interface AnalysisResult {
  atsScore: number;
  analysisReport: string;
  updatedResume: string;
}

export function ResumeAnalysisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setResumeDataUri(null);

    try {
      const file = data.resume[0];
      const dataUri = await fileToDataUri(file);
      setResumeDataUri(dataUri);

      const analysisResult = await generateUpdatedResume({ 
        resumeDataUri: dataUri,
        jobDescription: data.jobDescription,
      });
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.updatedResume) {
      const blob = new Blob([result.updatedResume], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'updated-resume.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume File</Label>
            <Input id="resume" type="file" {...register('resume')} />
            {errors.resume && (
              <p className="text-sm text-destructive">{errors.resume.message as string}</p>
            )}
          </div>
           <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here..."
              className="min-h-[150px]"
              {...register('jobDescription')}
            />
            {errors.jobDescription && (
              <p className="text-sm text-destructive">{errors.jobDescription.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze Now
          </Button>
        </CardFooter>
      </form>

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
        
        {result && resumeDataUri && !isLoading && (
            <CardContent className="mt-6">
                 <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle className="font-headline">Live ATS Score</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ATSScoreGauge score={result.atsScore} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-2">
                         <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="font-headline flex items-center gap-2"><Wand2 size={20}/> Analysis Report</CardTitle>
                                <Button onClick={handleDownload} variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Updated Resume
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[250px] border rounded-lg p-4 bg-secondary/30">
                                <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                    {result.analysisReport}
                                </ReactMarkdown>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                 </div>
                 
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-bold font-headline mb-4">Your Resume</h2>
                        <div className="h-[600px] border rounded-lg">
                           <iframe src={resumeDataUri} width="100%" height="100%" title="Resume Preview"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2">Optimized Resume</h2>
                        <ScrollArea className="h-[600px] border rounded-lg p-4 bg-secondary/30">
                            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                {result.updatedResume}
                            </ReactMarkdown>
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>
        )}
    </>
  );
}
