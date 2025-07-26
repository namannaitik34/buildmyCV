"use client"
import React, { useEffect, useState } from 'react';

interface ATSScoreGaugeProps {
  score: number;
}

export function ATSScoreGauge({ score }: ATSScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDisplayScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-secondary"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
          />
          <circle
            className="text-accent"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-headline text-foreground">
            {Math.round(displayScore)}%
          </span>
          <span className="text-sm text-muted-foreground">ATS Score</span>
        </div>
      </div>
    </div>
  );
}
