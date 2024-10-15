import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

export default function TabCategoryInput({
  previousName,
  onSave,
  onClose,
}: {
  onSave: (name: string) => void;
  onClose: () => void;
  previousName?: string;
}) {
  const [name, setName] = useState<string>(previousName);
  return (
    <div
      className={`px-4 py-1.5 rounded-full bg-tint-lightest text-blackcursor-pointer flex items-center gap-2`}
    >
      <input
        className="text-xs font-semibold line-clamp-1 text-nowrap outline-none border-none bg-transparent"
        autoFocus
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setName(name);
          }
        }}
      />
      <IoIosCloseCircle className="text-red-700 text-2xl" onClick={onClose} />
      <FaCheckCircle className="text-xl" onClick={() => onSave(name)} />
    </div>
  );
}
