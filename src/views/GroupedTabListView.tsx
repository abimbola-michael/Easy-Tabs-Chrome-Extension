import { TabGroup } from "../interfaces/TabGroup";
import TabListView from "./TabListView";
import { TabMode } from "../enums/enums";
import { ChromeTab, ThumbnailObject } from "../interfaces/ChromeTab";

export default function GroupedTabListView({
  tabGroups,
  tabMode,
  selectedTabId,
  onClick,
  onOptionSelect,
  category,
  categories,
  onCategorySelect,
  thumbnails,
}: {
  tabGroups: TabGroup[];
  selectedTabId: number | undefined;
  tabMode: TabMode;
  onClick: (tab: ChromeTab) => void;
  onOptionSelect: (name: string, tab: ChromeTab) => void;
  category: string;
  categories: string[];
  onCategorySelect: (name: string, tab: ChromeTab) => void;
  thumbnails: ThumbnailObject[];
}) {
  return (
    <ul className="flex flex-col gap-4">
      {tabGroups.map((tabGroup) => {
        return (
          <li
            key={tabGroup.groupName}
            className="flex flex-col gap-2 items-start"
          >
            <h2 className="font-bold text-sm">{tabGroup.groupName}</h2>
            {tabGroup.tabs.length === 0 ? (
              <div className="w-full py-2 flex items-center justify-center">
                No tabs
              </div>
            ) : (
              <TabListView
                selectedTabId={selectedTabId}
                tabMode={tabMode}
                tabs={tabGroup.tabs}
                onClick={onClick}
                onOptionSelect={onOptionSelect}
                category={category}
                categories={categories}
                onCategorySelect={onCategorySelect}
                thumbnails={thumbnails}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
