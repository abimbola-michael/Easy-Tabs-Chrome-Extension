import { MdClose, MdEdit } from "react-icons/md";
import { TabCategory } from "../interfaces/TabCategory";
import { IoIosCloseCircle } from "react-icons/io";
import CircleButton from "./CircleButton";

export default function TabCategoryItem({
  isDeleteMode,
  selectedCategory,
  category,
  onClick,
  onRemove,
  onEdit,
}: // onLongPress,
{
  isDeleteMode: boolean;
  selectedCategory: string;
  category: string;
  onClick: () => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={`px-4 py-1.5 rounded-full ${
        category == selectedCategory
          ? "bg-off-tint text-off-tint"
          : "bg-tint-lightest text-tint"
      } cursor-pointer flex items-center gap-2`}
      onClick={onClick}
    >
      <span className="text-xs font-semibold line-clamp-1 text-nowrap">
        {category}
      </span>
      {isDeleteMode && (
        <div className="flex gap-1 items-center text-sm">
          <CircleButton
            className="w-4 h-4"
            style={{ backgroundColor: "#ef4444" }}
            onClick={onRemove}
          >
            <MdClose />{" "}
          </CircleButton>
          <CircleButton className="w-4 h-4" onClick={onEdit}>
            <MdEdit />
          </CircleButton>

          {/* <IoIosCloseCircle
            className="text-red-700 text-2xl"
            onClick={onClose}
          /> */}
        </div>
      )}
    </div>
  );
}
