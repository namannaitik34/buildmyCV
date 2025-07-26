import { ResumeAnalysisClient } from "@/components/resume-analysis/ResumeAnalysisClient";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch } from 'lucide-react';

export default function ResumeAnalysisPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="mb-4 p-4 bg-accent/10 rounded-full">
            <FileSearch className="h-12 w-12 text-accent" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline mb-2">
          AI Resume Analysis
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Upload your resume to get instant, AI-powered feedback. Identify areas for improvement, discover missing keywords, and see how you stack up.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline">Analyze Your Resume</CardTitle>
            <CardDescription>Upload a .pdf, .doc, or .docx file (max 5MB).</CardDescription>
        </CardHeader>
        <ResumeAnalysisClient />
      </Card>
    </div>
  );
}
