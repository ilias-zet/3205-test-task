import { ButtonHTMLAttributes, ReactNode } from "react"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode | ReactNode[];
  className?: string;
}

export default function IconButton({ children, className = '', ...props }: IconButtonProps) {
  return (
    <button className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-400/20 active:bg-gray-500/20 ${className}`} {...props}>
      {children}
    </button>
  );
}
