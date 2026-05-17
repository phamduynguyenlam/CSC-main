import React from 'react';
import { Card } from './Card';
import { Feature } from '../types';

interface GeneratedContentViewProps {
  title: string;
  content?: string;
  featureList?: Feature[];
}

const GeneratedContentView: React.FC<GeneratedContentViewProps> = ({ title, content, featureList }) => {
    
    const renderContent = () => {
        if (content) {
            return content.split('\n').map((paragraph, index) => {
                if (paragraph.trim().startsWith('###')) {
                    return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-brand-secondary">{paragraph.replace('###', '').trim()}</h3>
                }
                if (paragraph.trim().startsWith('**')) {
                    const cleanText = paragraph.replace(/\*\*/g, '');
                    return <p key={index} className="font-bold text-text-primary mt-4">{cleanText}</p>
                }
                if (paragraph.trim().startsWith('- ')) {
                     return <li key={index} className="ml-6 list-disc">{paragraph.replace('- ', '').trim()}</li>
                }
                return <p key={index} className="my-2 text-text-secondary leading-relaxed">{paragraph}</p>;
            });
        }
        return null;
    }

    const renderFeatures = () => {
        if (featureList) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featureList.map((feature, index) => (
                        <div key={index} className="p-6 bg-bg-tertiary/50 rounded-lg border border-bg-tertiary hover:border-brand-secondary transition-colors">
                           <h3 className="text-xl font-semibold text-brand-secondary mb-2">{feature.title}</h3>
                           <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            )
        }
        return null;
    }

  return (
    <Card title={title}>
      <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary space-y-6">
          {renderContent()}
          {renderFeatures()}
      </div>
    </Card>
  );
};

export default GeneratedContentView;