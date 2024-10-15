import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function UrlSearchInput({
  url,
  onSearch,
}: {
  url?: string;
  onSearch: (url: string) => void;
}) {
  const [value, setValue] = useState<string>(() => url);
  return (
    <div
      className={`flex-1 px-4 py-2 rounded-full bg-tint-lightest text-blackcursor-pointer flex items-center gap-2`}
    >
      <FaGoogle className="text-sm" />
      <input
        className="w-full text-sm font-semibold line-clamp-1 text-nowrap outline-none border-none bg-transparent"
        autoFocus
        placeholder="Search Google or Type a URL"
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(value);
          }
        }}
      />
    </div>
  );
}
