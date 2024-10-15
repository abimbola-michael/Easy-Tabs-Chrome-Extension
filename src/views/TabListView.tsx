import { TabMode } from "../enums/enums";
import { ChromeTab, ThumbnailObject } from "../interfaces/ChromeTab";
import TabItem from "../components/TabItem";

export default function TabListView({
  tabMode,
  tabs,
  selectedTabId,
  onClick,
  onOptionSelect,
  category,
  categories,
  onCategorySelect,
  thumbnails,
  isFullHeight,
}: {
  selectedTabId: number | undefined;
  tabMode: TabMode;
  tabs: ChromeTab[];
  onClick: (tab: ChromeTab) => void;
  onOptionSelect: (name: string, tab: ChromeTab) => void;
  category: string;
  categories: string[];
  onCategorySelect: (name: string, tab: ChromeTab) => void;
  thumbnails: ThumbnailObject[];
  isFullHeight?: boolean;
}) {
  if (tabMode === TabMode.list) {
    return (
      <ul
        className="w-full flex flex-col items-center gap-1"
        style={{ height: isFullHeight ? "100%" : undefined }}
      >
        {tabs.map((tab, index) => {
          return (
            <TabItem
              key={index}
              tab={tab}
              selectedTabId={selectedTabId}
              onClick={() => onClick(tab)}
              onOptionSelect={(name) => onOptionSelect(name, tab)}
              category={category}
              categories={categories}
              onCategorySelect={(name) => onCategorySelect(name, tab)}
              thumbnails={thumbnails}
            />
          );
        })}
      </ul>
    );
  }

  function getRowLength(): number {
    return Math.ceil(tabs.length / 10);
  }

  function getColLength(rowIndex: number): number {
    const rowLength = getRowLength();
    return rowIndex === rowLength - 1 && tabs.length % 10 !== 0
      ? tabs.length % 10
      : 10;
  }

  function getIndex(colIndex: number, rowIndex: number): number {
    return rowIndex * 10 + colIndex;
  }
  //   console.log("rowLength =", getRowLength());
  return (
    <ul
      className="w-full flex"
      style={{ height: isFullHeight ? "100%" : undefined }}
    >
      {Array.from(
        {
          length: getRowLength(),
        },
        (_, rowIndex) => {
          const colCount = getColLength(rowIndex);
          const maxRowLength =
            tabs.length <= 10
              ? 2
              : tabs.length > 100
              ? 10
              : Math.ceil(tabs.length / 10);
          //   console.log("colCount =", colCount);

          return (
            <li
              key={rowIndex}
              className={`flex flex-col items-start justify-start gap-2 px-1`}
              style={{
                width: `calc(100%/${maxRowLength})`,
              }}
            >
              {Array.from(
                {
                  length: colCount,
                },
                (_, colIndex) => {
                  const actualIndex = getIndex(colIndex, rowIndex);
                  const tab = tabs[actualIndex];
                  //   console.log("actualIndex =", actualIndex);

                  return (
                    <TabItem
                      key={actualIndex}
                      //key={tab.id}
                      tab={tab}
                      selectedTabId={selectedTabId}
                      onClick={() => onClick(tab)}
                      // onClose={() => onClose(tab)}
                      onOptionSelect={(name) => onOptionSelect(name, tab)}
                      category={category}
                      categories={categories}
                      onCategorySelect={(name) => onCategorySelect(name, tab)}
                      thumbnails={thumbnails}
                    />
                  );
                }
              )}
            </li>
          );
        }
      )}
    </ul>
  );
}

// export default function TabListView({
//   tabMode,
//   tabs,
//   selectedTabId,
//   onClick,
//   onOptionSelect,
// }: {
//   selectedTabId: number | undefined;
//   tabMode: TabMode;
//   tabs: ChromeTab[];
//   onClick: (tab: ChromeTab) => void;
//   onOptionSelect: (name: string, tab: ChromeTab) => void;
// }) {
//   function getColLength(): number {
//     if (tabMode === TabMode.list) return tabs.length;

//     return Math.ceil(
//       tabs.length < 10 ? tabs.length : tabs.length > 100 ? tabs.length / 10 : 10
//     );
//   }

//   function getRowLength(colIndex: number): number {
//     if (tabMode === TabMode.list) return 1;
//     return tabs.length < 10
//       ? 1
//       : tabs.length > 100
//       ? colIndex === Math.floor(tabs.length / 10)
//         ? tabs.length % 10
//         : 10
//       : colIndex < 10 - (tabs.length % 10)
//       ? Math.floor(tabs.length / 10)
//       : Math.floor(tabs.length / 10) + 1;
//   }

//   function getIndex(colIndex: number, rowIndex: number): number {
//     if (tabMode === TabMode.list) return colIndex;
//     return tabs.length < 10
//       ? colIndex
//       : tabs.length > 100
//       ? colIndex * 10 + rowIndex
//       : colIndex < 10 - (tabs.length % 10)
//       ? colIndex * Math.floor(tabs.length / 10) + rowIndex
//       : colIndex * Math.floor(tabs.length / 10) +
//         rowIndex +
//         (colIndex - (10 - (tabs.length % 10)));
//   }
//   //   console.log("colLength =", getColLength(), "tabMode", tabMode);
//   return (
//     <ul className="w-full flex flex-col gap-2">
//       {Array.from(
//         {
//           length: getColLength(),
//         },
//         (_, colIndex) => {
//           const rowCount = getRowLength(colIndex);
//           //   console.log("rowCount =", rowCount);

//           return (
//             <li
//               key={colIndex}
//               className="w-full flex items-center gap-1 justify-stretch"
//             >
//               {Array.from(
//                 {
//                   length: rowCount,
//                 },
//                 (_, rowIndex) => {
//                   const actualIndex = getIndex(colIndex, rowIndex);
//                   const tab = tabs[actualIndex];
//                   //   console.log("actualIndex =", actualIndex);

//                   return (
//                     <TabItem
//                       key={actualIndex}
//                       //key={tab.id}
//                       tab={tab}
//                       selectedTabId={selectedTabId}
//                       onClick={() => onClick(tab)}
//                       // onClose={() => onClose(tab)}
//                       onOptionSelect={(name) => onOptionSelect(name, tab)}
//                     />
//                   );
//                 }
//               )}
//             </li>
//           );
//         }
//       )}
//     </ul>
//   );
// }
