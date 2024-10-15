import { ReactNode } from "react";

export default function CircleButton({
  children,
  className,
  style,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      className={`w-7 h-7 rounded-full text-lg font-bold bg-tint-lightest flex items-center justify-center ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
