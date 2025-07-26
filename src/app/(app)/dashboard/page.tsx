import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, FileText, Briefcase } from 'lucide-react';
import { ResumeEffectivenessChart } from '@/components/dashboard/ResumeEffectivenessChart';
import { ATSScoreGauge } from '@/components/dashboard/ATSScoreGauge';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline mb-8">
        Performance Dashboard
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ATS Compatibility</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords Match</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">For "Senior Software Engineer"</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Matched</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-5">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Resume Effectiveness</CardTitle>
            <CardDescription>
              Analysis of your resume's performance over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResumeEffectivenessChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Live ATS Score</CardTitle>
            <CardDescription>
              Your current resume's compatibility score.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ATSScoreGauge score={88} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
