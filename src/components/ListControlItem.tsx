export default function ListControlItem({
  selectedOption,
  option,
  onClick,
  onClose,
}: {
  selectedOption?: string;
  option: string;
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`px-3 py-1 rounded-full ${
        option == selectedOption
          ? "bg-off-tint text-off-tint"
          : "bg-tint-lightest text-tint"
      } cursor-pointer flex items-center gap-2`}
      onClick={onClick}
    >
      <span className="text-xs font-semibold line-clamp-1 text-nowrap">
        {option}
      </span>
    </div>
  );
}
