import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const Card: React.FC<CardProps> = ({ title, children, icon: Icon }) => {
  return (
    <div className="bg-bg-secondary rounded-xl shadow-lg p-6 border border-bg-tertiary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-primary/50">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-brand-primary mr-3" />}
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};