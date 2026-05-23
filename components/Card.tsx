import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const Card: React.FC<CardProps> = ({ title, children, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-[#0A2540] rounded-xl shadow-md p-6 border border-gray-200 dark:border-[#00b4d8]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#0077b6]/50">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-[#0077b6] mr-3" />}
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};