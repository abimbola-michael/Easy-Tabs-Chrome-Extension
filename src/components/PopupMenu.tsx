import React, { ReactNode } from "react";

export default function PopupMenu({
  options,
  onOptionSelect,
  builder,
  title,
}: {
  options?: string[];
  onOptionSelect?: (option: string, index?: number) => void;
  title?: ReactNode;
  builder?: (option?: string, index?: number) => ReactNode | undefined;
}) {
  return (
    <ul
      className={`flex flex-col gap-1 items-start bg-tint-lightest bg-white rounded-lg`}
    >
      <h2 className="font-bold">{title}</h2>
      {options?.map((option, index) => {
        const node = builder?.(option, index);
        return (
          <li
            key={index}
            className="w-full text-xs text-ellipsis text-nowrap px-4 py-2 hover:bg-tint-lightest rounded-lg"
            onClick={(e) => {
              onOptionSelect?.(option, index);
            }}
          >
            {node === undefined ? option : node}
          </li>
        );
      })}
    </ul>
  );
}
