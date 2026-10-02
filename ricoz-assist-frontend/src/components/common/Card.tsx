import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn(
      'rounded-2xl border border-gray-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
      'transition-all duration-200 ease-in-out hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:border-gray-300/90',
      'sm:p-6',
      className
    )} {...props}>
      {children}
    </div>
  );
};

export default Card;
