import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const Card: React.FC<CardProps> = ({ title, children, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-ring/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-700/50">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-blue-700 mr-3" />}
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};