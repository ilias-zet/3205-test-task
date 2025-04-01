import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode | ReactNode[];
  className?: string;
}

export default function Button({ children, className, ...props}: ButtonProps) {
  return (
    <button className={`items-center min-h-8 min-w-12 text-nowrap overflow-hidden overflow-ellipsis bg-blue-600 text-white rounded-md px-2 py-1 cursor-pointer hover:bg-blue-500 active:bg-blue-700 ${className}`} {...props}>
      {children}
    </button>
  );
}
