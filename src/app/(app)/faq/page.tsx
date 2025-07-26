import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the AI resume analysis work?",
    answer:
      "Our AI uses advanced natural language processing (NLP) models to scan your resume for key information. It analyzes structure, content, keywords, and formatting to provide actionable feedback, similar to how a human recruiter would, but with the added ability to check for compatibility with Applicant Tracking Systems (ATS).",
  },
  {
    question: "What is an ATS and why is it important?",
    answer:
      "An Applicant Tracking System (ATS) is software used by employers to manage job applications. It scans resumes for specific keywords and formatting to filter candidates. If your resume isn't ATS-friendly, it might be rejected before a human ever sees it. Our tool helps ensure your resume passes this initial screening.",
  },
  {
    question: "How does the Smart Job Matching feature improve my resume?",
    answer:
      "The Smart Job Matching feature directly compares your resume against a specific job description you provide. It identifies crucial keywords, skills, and qualifications from the job post that are missing or underemphasized in your resume and gives you specific suggestions on how to incorporate them.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "Yes, your privacy and data security are our top priorities. We use industry-standard encryption to protect your data both in transit and at rest. Your resume is only used for the analysis you request and is not shared with any third parties.",
  },
  {
    question: "What file formats can I upload for analysis?",
    answer:
      "We currently support the most common resume formats: PDF (.pdf), Microsoft Word (.doc, .docx). For best results, we recommend using a PDF.",
  },
  {
    question: "How often should I update and analyze my resume?",
    answer:
      "We recommend analyzing your resume every time you apply for a new job, using our Smart Job Matching feature to tailor it to the specific role. It's also a good practice to do a general review and update of your resume every 3-6 months to keep it fresh.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="mb-4 p-4 bg-accent/10 rounded-full">
          <HelpCircle className="h-12 w-12 text-accent" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about BuildMyCV.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="font-semibold text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
