import { ChromeTab, ThumbnailObject } from "../interfaces/ChromeTab";
import { IoIosMore } from "react-icons/io";
import PopupMenuButton from "./PopupMenuButton";
import TabDetailsView from "../views/TabDetailsView";
import { FaChrome } from "react-icons/fa6";

export default function TabItem({
  selectedTabId,
  tab,
  onClick,
  onOptionSelect,
  category,
  categories,
  onCategorySelect,
  thumbnails,
}: {
  tab: ChromeTab;
  selectedTabId: number | undefined;
  onClick: () => void;
  onOptionSelect: (name: string) => void;
  category: string;
  categories: string[];
  onCategorySelect: (name: string) => void;
  thumbnails: ThumbnailObject[];
}) {
  const selected = selectedTabId !== undefined && selectedTabId == tab.id;
  const tabOptions =
    category === "Current"
      ? [
          "Close",
          tab.pinned ? "UnPin" : "Pin",
          // "Add Tab",
          "Add to Favorites",
          categories.length > 0 && "Add to Category",
        ]
      : category === "Pinned"
      ? ["UnPin"]
      : category === "All"
      ? []
      : [`Remove from ${category}`];
  return (
    <div
      className={`w-full flex items-center gap-2 cursor-pointer rounded-lg px-2 ${
        selected ? "bg-tint-lightest" : "bg-transparent"
      }`}
      onClick={onClick}
    >
      <div className="flex-1">
        <PopupMenuButton
          onHoverPopup={<TabDetailsView tab={tab} thumbnails={thumbnails} />}
        >
          <div className="w-full flex-1 flex items-center gap-2 py-2">
            {tab.favIconUrl ? (
              <img src={tab.favIconUrl} alt="Tab Icon" className="w-4 h-4" />
            ) : (
              <FaChrome className="text-lg" />
            )}
            <span className="flex-1 text-xs text-nowrap text-ellipsis overflow-hidden w-0">
              {tab.title ?? (tab.url === "" ? "New Tab" : tab.url)}
            </span>
          </div>
        </PopupMenuButton>
      </div>
      {category !== "All" && (
        <div className="flex-shrink-0">
          <PopupMenuButton
            onClickPopup={{
              options: tabOptions,
              onOptionSelect: onOptionSelect,
              builder: (option, index) => {
                if (option === "Add to Category") {
                  // console.log("option", option);
                  return (
                    <PopupMenuButton
                      onClickPopup={{
                        //title: "Add Category",
                        options: categories.map(
                          (category) => `Add to ${category}`
                        ),
                        onOptionSelect: onCategorySelect,
                      }}
                    >
                      {option}
                    </PopupMenuButton>
                  );
                }
                return undefined;
              },
            }}
          >
            <IoIosMore className="text-xl" />
          </PopupMenuButton>
        </div>
      )}
    </div>
  );
}
