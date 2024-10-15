import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function UrlSearchInput({
  prevUrl = "",
  onSearch,
}: {
  prevUrl?: string;
  onSearch: (url: string) => void;
}) {
  const [url, setUrl] = useState<string>(prevUrl);
  return (
    <div
      className={`flex-1 px-4 py-2 rounded-full bg-tint-lightest text-blackcursor-pointer flex items-center gap-2`}
    >
      <FaGoogle className="text-sm" />
      <input
        className="w-full text-sm font-semibold line-clamp-1 text-nowrap outline-none border-none bg-transparent"
        autoFocus
        placeholder="Search Google or Type a URL"
        value={url}
        onChange={(e) => {
          setUrl(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(url);
          }
        }}
      />
    </div>
  );
}
