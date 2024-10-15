import { ReactNode } from "react";

export default function ListControlLogoItem({
  children,
  title,
  isLargeText = false,
}: {
  children: ReactNode;
  title?: string;
  isLargeText?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0">
      <div className="h-[30px] flex flex-col  justify-center">{children}</div>

      <p
        className={`${
          isLargeText ? "w-full" : "w-[50px]"
        }  text-center text-[10px] leading-[10px] text-ellipsis line-clamp-1 text-nowrap text-tint-light`}
      >
        {title}
      </p>
    </div>
  );
}
