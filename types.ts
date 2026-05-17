// FIX: Import React to resolve 'React' namespace errors.
import React from 'react';

export type View = 'dashboard' | 'liveCalls' | 'analytics' | 'socialMedia' | 'swot' | 'askAI' | 'settings' | 'profile';

export interface GeneratedContent {
  productSummary: string;
}

// FIX: Add Feature interface to resolve import error in GeneratedContentView.tsx.
export interface Feature {
  title: string;
  description: string;
}

// FIX: Add AmazonCaseStudy interface to resolve import error in AmazonCaseStudyView.tsx.
export interface AmazonCaseStudy {
  overview: string;
  frustrationPoints: {
    name: string;
    value: number;
  }[];
  workflow: {
    trigger: string;
    steps: string[];
  };
  aiSolutions: {
    title: string;
    description: string;
  }[];
}

export interface SidebarItem {
    id: View;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}