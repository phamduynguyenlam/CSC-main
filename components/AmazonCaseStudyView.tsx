import React from 'react';
import { Card } from './Card';
import { AmazonCaseStudy } from '../types';
import { FrustrationIcon, TrendUpIcon, DataFlowIcon, SummaryIcon } from './icons/Icons';

interface AmazonCaseStudyViewProps {
  content: AmazonCaseStudy;
}

const AmazonCaseStudyView: React.FC<AmazonCaseStudyViewProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="lg:col-span-2">
        <Card title="Amazon CX Challenge Overview" icon={SummaryIcon}>
          <p className="text-text-secondary leading-relaxed">{content.overview}</p>
        </Card>
      </div>

      <div>
        <Card title="Top Customer Frustration Points" icon={FrustrationIcon}>
            <div className="space-y-4">
                {content.frustrationPoints.map((point, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-text-primary">{point.name}</span>
                            <span className="text-sm font-medium text-text-primary">{point.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-[#0077b6] rounded-full h-2.5">
                            <div className="bg-[#0077b6] h-2.5 rounded-full" style={{ width: `${point.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>

       <div>
         <Card title="Simulated Automated Workflow" icon={DataFlowIcon}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-text-primary">Trigger:</h4>
                    <p className="text-text-secondary p-3 bg-slate-100 dark:bg-[#0077b6]/50 rounded-md mt-1">{content.workflow.trigger}</p>
                </div>
                <div>
                    <h4 className="font-bold text-text-primary">Automated Actions:</h4>
                    <ol className="relative border-l border-gray-200 dark:border-[#00b4d8] mt-2 ml-2">
                        {content.workflow.steps.map((step, index) => (
                            <li key={index} className="mb-4 ml-4">
                                <div className="absolute w-3 h-3 bg-[#00b4d8] rounded-full mt-1.5 -left-1.5 border border-white dark:border-[#0A2540]"></div>
                                <p className="text-sm font-normal text-text-secondary">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card title="AI-Generated Solutions" icon={TrendUpIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.aiSolutions.map((solution, index) => (
              <div key={index} className="p-4 bg-slate-100 dark:bg-[#0077b6]/50 rounded-lg border border-gray-200 dark:border-[#00b4d8] hover:border-[#00b4d8] transition-colors">
                <h3 className="font-semibold text-[#00b4d8]">{solution.title}</h3>
                <p className="text-text-secondary mt-1">{solution.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AmazonCaseStudyView;