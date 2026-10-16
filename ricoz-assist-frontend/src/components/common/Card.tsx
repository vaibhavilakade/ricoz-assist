import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn(
      'rounded-xl border border-border bg-white p-5 shadow-sm',
      'transition-all duration-150 ease-in-out hover:shadow-md',
      'sm:p-6',
      className
    )} {...props}>
      {children}
    </div>
  );
};

export default Card;
