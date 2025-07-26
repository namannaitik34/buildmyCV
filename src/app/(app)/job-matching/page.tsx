import { JobMatchClient } from "@/components/job-matching/JobMatchClient";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompareArrows } from 'lucide-react';

export default function JobMatchingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="flex flex-col items-center text-center mb-12">
        <div className="mb-4 p-4 bg-accent/10 rounded-full">
            <GitCompareArrows className="h-12 w-12 text-accent" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline mb-2">
          Smart Job Matching
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Paste your resume and a job description to get tailored suggestions. Optimize your resume for each application and increase your chances of landing an interview.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Optimize Your Resume for a Job</CardTitle>
          <CardDescription>
            Provide your resume content and the description of the job you're targeting.
          </CardDescription>
        </CardHeader>
        <JobMatchClient />
      </Card>
    </div>
  );
}
