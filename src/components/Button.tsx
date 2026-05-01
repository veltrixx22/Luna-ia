import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  full?: boolean;
  children: ReactNode;
};

export function Button({ variant = 'primary', full, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${full ? 'btn-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
}
