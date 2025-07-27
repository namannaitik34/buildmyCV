"use client";
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { matchJobs } from '@/ai/flows/match-jobs';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Lightbulb, CheckCircle, Download, FileUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fileToText, fileToDataUri } from '@/lib/file-utils';
import jsPDF from 'jspdf';
import { Eye } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];


const formSchema = z.object({
  resumeText: z.string().optional(),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  resumeFile: z.any().optional(),
}).refine(data => (data.resumeText && data.resumeText.length >= 100) || data.resumeFile?.length === 1, {
  message: 'Please either paste your resume (min 100 chars) or upload a file.',
  path: ['resumeText'],
}).refine(data => {
    if (data.resumeFile && data.resumeFile.length === 1) {
        return data.resumeFile?.[0]?.size <= MAX_FILE_SIZE;
    }
    return true;
    }, {
        message: `Max file size is 5MB.`,
        path: ['resumeFile'],
    }
).refine(data => {
    if (data.resumeFile && data.resumeFile.length === 1) {
        return ACCEPTED_FILE_TYPES.includes(data.resumeFile?.[0]?.type);
    }
    return true;
}, {
    message: 'Only .pdf, .docx, and .txt files are accepted.',
    path: ['resumeFile'],
});


type FormValues = z.infer<typeof formSchema>;

interface Result {
    suggestions: string[];
    updatedResume: string;
}

export function JobMatchClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const resumeFile = watch('resumeFile');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      let resumeText = data.resumeText;
      if (data.resumeFile && data.resumeFile.length > 0) {
        const file = data.resumeFile[0];
        resumeText = await fileToText(file);
      }

      if (!resumeText) {
        setError('Could not extract text from the resume.');
        setIsLoading(false);
        return;
      }

      const matchResult = await matchJobs({ resumeText, jobDescription: data.jobDescription });
      setResult(matchResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePdf = (text: string, action: 'download' | 'preview') => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - margin * 2);
    let cursor = margin;

    lines.forEach((line: string) => {
      if (cursor > pageHeight - margin) {
        doc.addPage();
        cursor = margin;
      }
      doc.text(line, margin, cursor);
      cursor += 7; // line height
    });

    if (action === 'download') {
      doc.save('updated-resume.pdf');
    } else {
      window.open(doc.output('bloburl'), '_blank');
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
            <Tabs defaultValue="paste" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste">Paste Resume</TabsTrigger>
                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="paste">
                <Card>
                    <CardHeader>
                        <CardTitle>Paste Resume</CardTitle>
                        <CardDescription>Paste the plain text of your resume below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Label htmlFor="resumeText" className="sr-only">Your Resume Text</Label>
                        <Textarea
                        id="resumeText"
                        placeholder="Paste the full text of your resume here..."
                        className="min-h-[200px]"
                        {...register('resumeText')}
                        />
                        {errors.resumeText && (
                        <p className="text-sm text-destructive">{errors.resumeText.message}</p>
                        )}
                    </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="upload">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Resume</CardTitle>
                        <CardDescription>Upload your resume as a .pdf, .docx, or .txt file (max 5MB).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Label htmlFor="resumeFile" className="sr-only">Your Resume File</Label>
                        <Input id="resumeFile" type="file" {...register('resumeFile')} />
                        {errors.resumeFile && (
                        <p className="text-sm text-destructive">{errors.resumeFile.message as string}</p>
                        )}
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here..."
              className="min-h-[200px]"
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
                <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Get Suggestions
            </Button>
          </CardFooter>
      </form>

      {(isLoading || result || error) && (
        <CardContent className="flex flex-col items-start space-y-4">
          {isLoading && (
            <div className="flex items-center text-muted-foreground w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Matching your resume to the job... This may take a moment.</span>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Suggestion Generation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <Card className="w-full bg-secondary/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline flex items-center gap-2"><Lightbulb/> Results</CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={() => generatePdf(result.updatedResume, 'preview')} variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview PDF
                        </Button>
                        <Button onClick={() => generatePdf(result.updatedResume, 'download')} variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Optimization Suggestions</h3>
                    <ul className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                        <span className="text-sm">{suggestion}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Updated Resume</h3>
                    <Textarea
                        readOnly
                        value={result.updatedResume}
                        className="min-h-[300px] bg-background"
                        />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      )}
    </>
  );
}
