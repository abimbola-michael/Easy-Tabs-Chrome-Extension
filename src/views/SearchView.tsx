import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

export default function SearchView({
  searchText,
  onSearch,
  onClose,
}: {
  searchText?: string;
  onSearch: (value: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState<string>(searchText || "");

  return (
    <div className="flex items-center gap-2 h-[40px] px-4 py-2">
      <IoArrowBack className="text-lg font-bold" onClick={onClose} />

      <div className="rounded-lg bg-tint-lightest px-4 py-1 flex-1 flex items-center h-[30px]">
        <input
          className="flex-1 text-sm line-clamp-1 text-nowrap outline-none border-none bg-transparent"
          autoFocus
          placeholder="Search..."
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
            onSearch(e.currentTarget.value);
          }}
        />
        <IoMdClose
          className="text-lg font-bold"
          onClick={() => {
            setText("");
            onSearch("");
          }}
        />
      </div>
    </div>
  );
}
