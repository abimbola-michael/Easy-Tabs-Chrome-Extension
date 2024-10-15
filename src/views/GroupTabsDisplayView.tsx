import React from "react";
import TabListView from "./TabListView";
import { ChromeTab, ThumbnailObject } from "../interfaces/ChromeTab";
import { TabMode } from "../enums/enums";
import ModalContainer from "./ModalContainer";
import { IoArrowBack } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

export default function GroupTabsDisplayView({
  tab,
  tabMode,
  selectedTabId,
  onClick,
  onOptionSelect,
  category,
  categories,
  onCategorySelect,
  thumbnails,
  onClose,
  onCreateTab,
}: {
  tab: ChromeTab;
  selectedTabId: number | undefined;
  tabMode: TabMode;
  onClick: (tab: ChromeTab) => void;
  onOptionSelect: (name: string, tab: ChromeTab) => void;
  category: string;
  categories: string[];
  onCategorySelect: (name: string, tab: ChromeTab) => void;
  thumbnails: ThumbnailObject[];
  onClose?: () => void;
  onCreateTab?: () => void;
}) {
  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center justify-between">
          <IoArrowBack className="text-lg font-bold" onClick={onClose} />

          <h2 className="font-bold text-sm">
            {tab.title || `${tab.groupTabs.length + 1} tabs`}
          </h2>
          <IoMdAdd className="text-2xl font-bold" onClick={onCreateTab} />
        </div>

        {tab.groupTabs.length === 0 ? (
          <div className="w-full py-2 flex items-center justify-center">
            No tabs
          </div>
        ) : (
          <TabListView
            selectedTabId={selectedTabId}
            tabMode={tabMode}
            tabs={tab.groupTabs}
            onClick={onClick}
            onOptionSelect={onOptionSelect}
            category={category}
            categories={categories}
            onCategorySelect={onCategorySelect}
            thumbnails={thumbnails}
          />
        )}
      </div>
    </ModalContainer>
  );
}
