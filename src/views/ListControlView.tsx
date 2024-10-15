import ListControlItem from "../components/ListControlItem";
import { ListControlMode } from "../enums/enums";
import { IoArrowBack } from "react-icons/io5";

export default function ListControlView({
  listControlMode,
  options,
  selectedOption,
  onOptionSelect,
  onClose,
}: {
  listControlMode: ListControlMode;
  options: string[];
  selectedOption?: string;
  onOptionSelect: (option: string) => void;
  onClose: () => void;
}) {
  function getTitle() {
    switch (listControlMode) {
      case ListControlMode.filter:
        return "Filter By:";
      case ListControlMode.sort:
        return "Sort By:";
      case ListControlMode.group:
        return "Group By:";
    }
    return "";
  }
  return (
    <div className="w-full flex items-center gap-2 text-lg h-[40px] px-4 py-2">
      <IoArrowBack className="text-lg font-bold" onClick={onClose} />
      <span className="text-sm font-bold">{getTitle()}</span>
      <ul
        className="flex-1 flex items-center gap-2 overflow-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        {options.map((option) => (
          <ListControlItem
            key={option}
            selectedOption={selectedOption}
            option={option}
            onClick={() => onOptionSelect(option)}
            onClose={onClose}
          />
        ))}
      </ul>
    </div>
  );
}
