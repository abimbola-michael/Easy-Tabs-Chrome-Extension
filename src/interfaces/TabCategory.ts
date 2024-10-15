import { ChromeTab } from "./ChromeTab";

export interface TabCategory {
  name: string;
  tabs: ChromeTab[];
}

export const defaultTabCategories: string[] = [
  "Current",
  "Pinned",
  "All",
  "Favorites",
];

// export const defaultTabCategories: TabCategory[] = [
//   { name: "Current", tabs: [] },
//   { name: "Pinned", tabs: [] },
//   // { name: "Grouped", tabs: [] },
//   // { name: "Top 10 visited", tabs: [] },
//   { name: "All", tabs: [] },
//   { name: "Favorites", tabs: [] },

//   // { name: "Highlighted", tabs: [] },
//   // { name: "Discarded", tabs: [] },
//   // { name: "Selected", tabs: [] },

//   // { name: "Ignito", tabs: [] },
// ];
