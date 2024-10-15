import { useState } from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

export default function TabInput({
  onSave,
  onClose,
}: {
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState<string>("");

  return (
    <div
      className={`inline-flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2 bg-transparent`}
    >
      <IoMdClose className="text-xl" onClick={onClose} />
      <input
        className="flex-1 text-sm line-clamp-1 text-nowrap outline-none border-none bg-transparent"
        autoFocus
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
      />

      <IoMdCheckmark
        className="text-black text-2xl"
        onClick={() => onSave(name)}
      />
    </div>
  );
}
