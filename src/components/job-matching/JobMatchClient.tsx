"use client";
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { matchJobs } from '@/ai/flows/match-jobs';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Lightbulb, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  resumeText: z.string().min(100, 'Resume text must be at least 100 characters.'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function JobMatchClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await matchJobs({ resumeText: data.resumeText, jobDescription: data.jobDescription });
      setSuggestions(result.suggestions);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resumeText">Your Resume Text</Label>
            <Textarea
              id="resumeText"
              placeholder="Paste the full text of your resume here..."
              className="min-h-[200px]"
              {...register('resumeText')}
            />
            {errors.resumeText && (
              <p className="text-sm text-destructive">{errors.resumeText.message}</p>
            )}
          </div>
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
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Get Suggestions
          </Button>
        </form>
      </CardContent>

      {(isLoading || suggestions || error) && (
        <CardFooter className="flex flex-col items-start space-y-4">
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
          {suggestions && (
            <Card className="w-full bg-secondary/50">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Lightbulb/> Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      )}
    </>
  );
}
