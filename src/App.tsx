import "@fontsource/dancing-script";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaLayerGroup,
  FaSearch,
  FaSort,
} from "react-icons/fa";
import { defaultTabCategories } from "./interfaces/TabCategory";
import TabCategoryItem from "./components/TabCategoryItem";
import { IoMdAdd } from "react-icons/io";
import { AppMode, ListControlMode, TabMode } from "./enums/enums";
import TabCategoryInput from "./components/TabCategoryInput";
import CircleButton from "./components/CircleButton";
import { FiGrid } from "react-icons/fi";
import { IoList } from "react-icons/io5";
import {
  ChromeTab,
  generatedTabs,
  ThumbnailObject,
} from "./interfaces/ChromeTab";
import { TabGroup } from "./interfaces/TabGroup";
import TabListView from "./views/TabListView";
import TabInput from "./components/TabInput";
import SearchView from "./views/SearchView";
import ListControlView from "./views/ListControlView";
import { ListControl } from "./interfaces/ListControl";
import ListControlLogoItem from "./components/ListControlLogoItem";
import {
  getDay,
  getMonth,
  getStartOfLastMonth,
  getStartOfLastWeek,
  getStartOfLastYear,
  getStartOfMonth,
  getStartOfToday,
  getStartOfWeek,
  getStartOfYear,
  getStartOfYesterday,
  getYear,
  parseDate,
} from "./utils/DateUtils";
import GroupedTabListView from "./views/GroupedTabListView";
import UrlSearchInput from "./components/UrlSearchInput";
import { FaArrowsRotate } from "react-icons/fa6";
import PopupMenuButton from "./components/PopupMenuButton";
import LongPressButton from "./components/LongPressButton";
import ClickOutsideView from "./views/ClickOutsideView";

function App() {
  // const [tabs, setTabs] = useState<chrome?.tabs?.Tab[] | []>([]);
  let currentTabs = useRef<ChromeTab[]>([]);

  const [tabs, setTabs] = useState<ChromeTab[]>([]);
  const [tabGroups, setTabGroups] = useState<TabGroup[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultTabCategories);
  const [thumbnails, setThumbnails] = useState<ThumbnailObject[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultTabCategories[0]
  );
  const [categoryUpdateIndex, setCategoryUpdateIndex] = useState<
    number | undefined
  >();
  const [selectedTab, setSelectedTab] = useState<ChromeTab | undefined>();

  const [currentAppMode, setCurrentAppMode] = useState<AppMode | undefined>();
  const [tabMode, setTabMode] = useState<TabMode>(TabMode.grid);
  const [listControlMode, setListControlMode] = useState<
    ListControlMode | undefined
  >();
  //let listControl = useRef<ListControl>({}).current;
  const [listControl, setListControl] = useState<ListControl>({});

  const categoryOptions = ["Rename", "Delete"];

  const sortOptions = ["Most Visited", "Name"];

  const filterOptions = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
  ];
  const groupOptions = ["Domain", "Day", "Month", "Year"];

  // Fetch all open tabs
  useEffect(() => {
    chrome?.tabs?.query({}, (tabs) => {
      setChromeTabs(tabs);
      captureThumbnails(tabs);
    });
  }, []);

  // Getting tab body thumbnails
  function captureThumbnails(tabs: chrome.tabs.Tab[]) {
    // const promises = tabs.map(
    //   (tab) =>
    //     new Promise<void>((resolve) => {
    //       if (tab.id) {
    //         chrome.tabs.captureVisibleTab({ format: "jpeg" }, (thumbnail) => {
    //           console.log("thumbnail = ", thumbnail);
    //           if (thumbnail) {
    //             setThumbnails((prev) => [
    //               ...prev,
    //               { id: tab.id!, title: tab.title!, thumbnail },
    //             ]);
    //           }
    //           resolve();
    //         });
    //       }
    //     })
    // );
    // Promise.all(promises);
    let lastCaptureTime = 0;
    tabs.forEach((tab) => {
      if (tab.active && tab.id) {
        const currentTime = new Date().getTime();
        if (currentTime - lastCaptureTime >= 1000) {
          // Ensure at least 1 second between captures
          chrome.tabs.captureVisibleTab(
            null,
            { format: "jpeg" },
            (thumbnail) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
              } else if (thumbnail) {
                setThumbnails((prev) => [
                  ...prev,
                  { id: tab.id!, title: tab.title!, thumbnail },
                ]);
              }
            }
          );
          lastCaptureTime = currentTime;
        }
      }
    });
  }

  // Listen to tab changes
  useEffect(() => {
    // Function to handle tab creation
    const handleTabCreated = (tab: chrome.tabs.Tab) => {
      // if ((category === "Pinned" && tab.pinned) || category !== "Pinned") {

      // }
      const newTab = { ...tab, visitsCount: 1 };
      addTabToCategory(newTab, "Current");
      addTabToCategory(newTab, "All");
      // setTabs((prevTabs) => [...prevTabs, { ...tab, visitsCount: 1 }]);
    };

    // Function to handle tab update
    const handleTabUpdated = (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      const newTab = { ...tab };
      updateTabInCategory(newTab, "Current");
      updateTabInCategory(newTab, "All");
      //if (changeInfo.status === "complete") {
      // setTabs((prevTabs) =>
      //   prevTabs.map((t) => (t.id === tabId ? { ...t, ...tab } : t))
      // );
      //}
    };

    // Function to handle tab removal
    const handleTabRemoved = (tabId: number) => {
      removeTabFromCategory(tabId, "Current");
      //setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
    };

    // Add Chrome tab event listeners
    chrome?.tabs?.onCreated.addListener(handleTabCreated);
    chrome?.tabs?.onUpdated.addListener(handleTabUpdated);
    chrome?.tabs?.onRemoved.addListener(handleTabRemoved);

    // Cleanup event listeners on component unmount
    return () => {
      chrome?.tabs?.onCreated.removeListener(handleTabCreated);
      chrome?.tabs?.onUpdated.removeListener(handleTabUpdated);
      chrome?.tabs?.onRemoved.removeListener(handleTabRemoved);
    };
  }, []);

  useEffect(() => {
    getTabs();
  }, [listControl, selectedCategory]);

  function sortTabs(option: string) {
    setListControl({
      ...listControl,
      sort: listControl.sort === option ? undefined : option,
    });
  }

  function filterTabs(option: string) {
    setListControl({
      ...listControl,
      filter: listControl.filter === option ? undefined : option,
    });
  }

  function groupTabs(option: string) {
    setListControl({
      ...listControl,
      group: listControl.group === option ? undefined : option,
    });
  }

  function searchTabs(text: string) {
    setListControl({
      ...listControl,
      search: text,
    });
  }

  function getTabs() {
    if (!chrome?.tabs) {
      setTabs(generatedTabs);
      return;
    }

    if (selectedCategory === "Current") {
      controlTabs(currentTabs.current);
    } else if (selectedCategory === "Pinned") {
      controlTabs(currentTabs.current.filter((tab) => tab.pinned));
    } else {
      getCategoryTabs(selectedCategory);
    }
  }

  function controlTabs(tabs: ChromeTab[]) {
    const group = listControl.group;

    if (group) {
      let tabGroups: TabGroup[] = [];

      switch (group) {
        case "Domain":
          tabGroups = getGroupedTabs(
            (tab) => (!tab.url ? "" : new URL(tab.url).hostname),
            tabs
          );
          break;
        case "Day":
          tabGroups = getGroupedTabs(
            (tab) => (!tab.lastAccessed ? "" : getDay(tab.lastAccessed)),
            tabs
          );
          break;
        case "Month":
          tabGroups = getGroupedTabs(
            (tab) => (!tab.lastAccessed ? "" : getMonth(tab.lastAccessed)),
            tabs
          );
          break;
        case "Year":
          tabGroups = getGroupedTabs(
            (tab) => (!tab.lastAccessed ? "" : getYear(tab.lastAccessed)),
            tabs
          );
          break;
      }
      for (let i = 0; i < tabGroups.length; i++) {
        const tabGroup = tabGroups[i];
        const controlledTabs = getControlledTabs(tabGroup.tabs);
        tabGroup.tabs = controlledTabs;
      }
      setTabGroups(tabGroups);
    } else {
      setTabs(getControlledTabs(tabs));
    }
  }

  function getGroupedTabs(
    callback: (tab: ChromeTab) => string,
    tabs: ChromeTab[]
  ): TabGroup[] {
    const tabGroups: TabGroup[] = [];
    const groupMap: Map<string, number> = new Map();
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const groupName = callback(tab);
      const prevIndex = groupMap.get(groupName);
      if (prevIndex === undefined) {
        groupMap.set(groupName, tabGroups.length);
        tabGroups.push({ groupName, tabs: [tab] });
      } else {
        tabGroups[prevIndex].tabs.push(tab);
      }
    }
    return tabGroups;
  }

  function getSortedTabs(
    callback: (tab: ChromeTab) => string | number | undefined,
    tabs: ChromeTab[]
  ): ChromeTab[] {
    return tabs.sort((a, b) => {
      const left = callback(a);
      const right = callback(b);
      return typeof left === "string" && typeof right === "string"
        ? right.localeCompare(left)
        : typeof left === "number" && typeof right === "number"
        ? right - left
        : 0;
    });
  }

  function getFilteredTabs(
    callback: (tab: ChromeTab) => boolean | undefined,
    tabs: ChromeTab[]
  ): ChromeTab[] {
    return tabs.filter((tab) => callback(tab));
  }

  function getControlledTabs(tabs: ChromeTab[]): ChromeTab[] {
    let newTabs: ChromeTab[] = [];
    newTabs.push(...tabs);

    const sort = listControl.sort;
    const filter = listControl.filter;
    const search = listControl.search;

    if (filter) {
      const today = getStartOfToday();
      const yesterday = getStartOfYesterday();
      const startOfThisWeek = getStartOfWeek();
      const { start: startOfLastWeek, end: endOfLastWeek } =
        getStartOfLastWeek();
      const startOfThisMonth = getStartOfMonth();
      const { start: startOfLastMonth, end: endOfLastMonth } =
        getStartOfLastMonth();
      const startOfThisYear = getStartOfYear();
      const { start: startOfLastYear, end: endOfLastYear } =
        getStartOfLastYear();

      switch (filter) {
        case "Today":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= today;
          }, newTabs);
          break;

        case "Yesterday":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= yesterday && itemDate < today;
          }, newTabs);
          break;

        case "This Week":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= startOfThisWeek;
          }, newTabs);
          break;

        case "Last Week":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
          }, newTabs);
          break;

        case "This Month":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= startOfThisMonth;
          }, newTabs);
          break;

        case "Last Month":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
          }, newTabs);
          break;

        case "This Year":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= startOfThisYear;
          }, newTabs);
          break;

        case "Last Year":
          newTabs = getFilteredTabs((tab) => {
            const itemDate = parseDate(tab.lastAccessed);
            return itemDate >= startOfLastYear && itemDate <= endOfLastYear;
          }, newTabs);
          break;
      }
    }

    if (search !== undefined) {
      newTabs = newTabs.filter(
        (tab) =>
          tab.url?.toLowerCase().includes(search.toLowerCase()) ||
          tab.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort) {
      switch (sort) {
        case "Most Visited":
          newTabs = getSortedTabs((tab) => tab.visitsCount, newTabs);
          break;

        case "Name":
          newTabs = getSortedTabs(
            (tab) => tab.title?.toLowerCase() || tab.url?.toLowerCase() || "",
            newTabs
          );
          break;
      }
    } else {
      newTabs = getSortedTabs((tab) => tab.lastAccessed, newTabs);
    }
    return newTabs;
  }

  function closePopup() {
    window.close(); // This will close the popup
  }

  function getCategories() {
    chrome?.storage?.local.get({ Categories: [] }, (result) => {
      setCategories((categories) => [...categories, ...result.Categories]);
    });
  }

  function addCategory(category: string) {
    chrome?.storage?.local.get({ Categories: [] }, (result) => {
      const values: string[] = result.Categories;
      values.push(category);

      chrome?.storage?.local.set({ Categories: values });
    });
    setCategories((categories) => [...categories, category]);
  }

  function updateCategory(prevCategory: string, category: string) {
    chrome?.storage?.local.get({ Categories: [] }, (result) => {
      const values: string[] = result.Categories;
      values.map((value) => (value === prevCategory ? category : value));

      chrome?.storage?.local.set({ Categories: values });
    });
    setCategories((categories) =>
      categories.map((loopCategory) =>
        loopCategory === prevCategory ? category : loopCategory
      )
    );
  }

  function removeCategory(category: string, index: number) {
    chrome?.storage?.local.get({ Categories: [] }, (result) => {
      const values: string[] = result.Categories;
      values.filter((value) => value !== category);

      chrome?.storage?.local.set({ Categories: values });
    });
    setCategories((categories) =>
      categories.filter((loopCategory) => loopCategory !== category)
    );
    removeChromeValue(category);
    if (category === selectedCategory) {
      if (categories.length > 0 && index > 0) {
        openTabCategory(categories[index - 1]);
      } else {
        setTabs([]);
      }
    }
  }

  function getCategoryTabs(category: string) {
    chrome?.storage?.local.get({ [category]: [] }, (result) => {
      controlTabs(result[category]);
    });
  }

  function modifyTabCategories(tabs: ChromeTab[], category: string) {
    chrome?.storage?.local.get({ [category]: [] }, (result) => {
      const newValues: ChromeTab[] = [];
      const values: ChromeTab[] = result[category];
      const tabsMap: Map<number, ChromeTab> = new Map();
      const valuesMap: Map<number, ChromeTab> = new Map();

      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value.id !== undefined) {
          valuesMap.set(value.id, value);
        }
      }

      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.id !== undefined) {
          const prevTab = valuesMap.get(tab.id);

          if (prevTab === undefined) {
            newValues.push(tab);
          } else {
            newValues.push({ ...prevTab, ...tab });
            tabsMap.set(tab.id, tab);
          }
        }
      }
      //newValues.push(...values);

      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value.id !== undefined) {
          const tab = tabsMap.get(value.id);
          if (tab === undefined) {
            newValues.push(value);
          }
        }
      }

      chrome?.storage?.local.set({ [category]: newValues });
    });
  }

  function addTabToCategory(tab: ChromeTab, category: string) {
    if (category === "Current") {
      currentTabs.current = [...currentTabs.current, tab];
      if (selectedCategory === category) {
        setTabs((tabs) => [...tabs, tab]);
      }
      return;
    }
    chrome?.storage?.local.get({ [category]: [] }, (result) => {
      const values: ChromeTab[] = result[category];
      values.push(tab);

      chrome?.storage?.local.set({ [category]: values });
    });

    setTabs((tabs) => [...tabs, tab]);
  }

  function updateTabInCategory(tab: ChromeTab, category: string) {
    if (category === "Current" || category === "Pinned") {
      currentTabs.current = currentTabs.current.map((value) =>
        value.id === tab.id ? { ...value, ...tab } : value
      );
      if (selectedCategory === category) {
        setTabs((tabs) =>
          tabs.map((value) =>
            value.id === tab.id ? { ...value, ...tab } : value
          )
        );
      }
      return;
    }
    chrome?.storage?.local.get({ [category]: [] }, (result) => {
      const values: ChromeTab[] = result[category];
      values.map((value) =>
        value.id === tab.id ? { ...value, ...tab } : value
      );

      chrome?.storage?.local.set({ [category]: values });
    });

    setTabs((tabs) =>
      tabs.map((value) => (value.id === tab.id ? { ...value, ...tab } : value))
    );
  }

  function removeTabFromCategory(tabId: number, category: string) {
    if (category === "Current" || category === "Pinned") {
      currentTabs.current = currentTabs.current.filter(
        (value) => value.id !== tabId
      );
      if (selectedCategory === category) {
        setTabs((tabs) => tabs.filter((value) => value.id !== tabId));
      }
      return;
    }
    chrome?.storage?.local.get({ [category]: [] }, (result) => {
      const values: ChromeTab[] = result[category];
      values.filter((value) => value.id !== tabId);

      chrome?.storage?.local.set({ [category]: values });
    });

    setTabs((tabs) => tabs.filter((value) => value.id !== tabId));
  }

  function removeChromeValue(category: string) {
    chrome?.storage?.local.remove(category);
  }
  function addChromeValue(category: string) {
    chrome?.storage?.local.set({ [category]: [] });
  }

  function setChromeTabs(tabs: chrome.tabs.Tab[]) {
    const chromeTabs: ChromeTab[] = [];
    const groupMap: Map<number, number> = new Map();
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];

      const chromeTab: ChromeTab = { ...tab, visitsCount: 1 };
      if (tab.active) {
        setSelectedTab(chromeTab);
      }
      if (tab.groupId === -1) {
        chromeTabs.push(chromeTab);
      } else {
        const groupIndex = groupMap.get(tab.groupId);
        if (groupIndex === undefined) {
          groupMap.set(tab.groupId, chromeTabs.length);
          chromeTab.groupTabs = [];
          chromeTabs.push(chromeTab);
        } else {
          const prevChromeTab = chromeTabs[groupIndex];
          prevChromeTab.groupTabs?.push(chromeTab);
        }
      }
    }

    currentTabs.current = chromeTabs;
    //removeChromeCategory("All");
    modifyTabCategories(chromeTabs, "All");
    getTabs();
    getCategories();
  }

  // function openTabByUrl(url: string) {
  //   chrome?.tabs?.query({ url: `*://${url}/*` }, (tabs) => {
  //     if (tabs.length > 0) {
  //       if (tabs[0].id !== undefined)
  //         chrome?.tabs?.update(tabs[0].id, { active: true });
  //     } else {
  //       //alert('Tab not found!');
  //     }
  //   });
  // }
  // function groupTabsByDomain() {
  //   const domainGroups: Record<string, number[]> = {};

  //   // Group tabs by domain
  //   tabs.forEach((tab) => {
  //     if (tab.url == undefined || tab.id === undefined) return;
  //     const url = new URL(tab.url);
  //     const domain = url.hostname;

  //     if (!domainGroups[domain]) {
  //       domainGroups[domain] = [];
  //     }
  //     domainGroups[domain].push(tab.id);
  //   });

  //   // Create tab groups for each domain
  //   Object.keys(domainGroups).forEach((domain) => {
  //     chrome?.tabs?.group({ tabIds: domainGroups[domain] }, (groupId) => {
  //       // Optionally update the group color or title
  //       chrome.tabGroups.update(groupId, { title: domain, color: "blue" });
  //     });
  //   });
  // }

  function closeTab(tab: ChromeTab) {
    if (tab.id !== undefined) chrome?.tabs?.remove(tab.id);
    setTabs(tabs.filter((prevTab) => prevTab.id !== tab.id));
  }

  function openTab(tab: ChromeTab) {
    setSelectedTab(tab);

    if (
      currentTabs.current.findIndex((prevTab) => prevTab.id === tab.id) !== -1
    ) {
      currentTabs.current.map((prevTab) =>
        prevTab.id === tab.id
          ? { ...prevTab, visitsCount: (prevTab.visitsCount ?? 1) + 1 }
          : prevTab
      );
      if (tab.id !== undefined) chrome?.tabs?.update(tab.id, { active: true });
    } else {
      currentTabs.current.map((prevTab) =>
        prevTab.id === tab.id ? { ...prevTab, visitsCount: 1 } : prevTab
      );
      if (tab.url !== undefined) chrome?.tabs?.create({ url: tab.url });
    }
  }

  function pinTab(tab: ChromeTab, pinned: boolean) {
    if (tab.id !== undefined) chrome?.tabs?.update(tab.id, { pinned: pinned });

    updateTab({ ...tab, pinned: true });
  }

  function addTabsToGroup(groupTab: ChromeTab, tabs: ChromeTab[]) {
    chrome?.tabs?.group(
      {
        tabIds: [
          groupTab.id!,
          ...groupTab.groupTabs?.map((tab) => tab.id!),
          ...tabs.map((tab) => tab.id!),
        ],
      },
      (groupId) => {
        // Optionally update the group color or title
        chrome?.tabGroups?.update(groupId, {
          // title: groupTab.title,
          color: "blue",
        });
      }
    );
    updateTab({
      ...groupTab,
      groupTabs: [...(groupTab?.groupTabs ?? []), ...tabs],
    });
  }

  function updateTab(tab: ChromeTab) {
    setTabs(tabs.filter((prevTab) => (prevTab.id === tab.id ? tab : prevTab)));

    updateTabInCategory(tab, selectedCategory);
  }

  function executeTabOption(name: string, tab: ChromeTab) {
    if (name.startsWith("Remove from")) {
      removeTabFromCategory(tab.id, name.substring(name.lastIndexOf(" ")));
      return;
    }
    switch (name) {
      case "Close":
        closeTab(tab);
        break;
      case "Pin":
        pinTab(tab, true);
        break;
      case "UnPin":
        pinTab(tab, false);
        break;
      case "Add Tab":
        break;
      case "Add to Favorites":
        addTabToCategory(tab, "Favorites");
        break;
      // case "Add to Category":
      //   break;
    }
  }
  function executeCategoryOption(option: string, name: string, index: number) {
    switch (option) {
      case "Rename":
        startEditTabCategory(index);
        break;
      case "Delete":
        removeCategory(name, index);
        break;
    }
  }

  function executeAddTabToCategoryOption(name: string, tab: ChromeTab) {
    if (name.startsWith("Add to")) {
      addTabToCategory(tab, name.substring(name.lastIndexOf(" ")));
      return;
    }
    addTabToCategory(tab, name);
  }
  function openTabCategory(category: string) {
    setSelectedCategory(category);
  }

  function closeTabCategory(category: string) {
    setCategories((categories) =>
      categories.filter((prevCategory) => prevCategory !== category)
    );
  }
  function startCreateTabCategory() {
    setCategoryUpdateIndex(-1);
  }
  function startEditTabCategory(index: number) {
    setCategoryUpdateIndex(index);
  }
  function closeCreateOrEditTabCategory() {
    setCategoryUpdateIndex(undefined);
  }
  function updateTabCategory(prevName: string, name: string) {
    if (!name || categories.includes(name)) {
      return;
    }
    updateCategory(prevName, name);
    closeCreateOrEditTabCategory();
    //resetAppModeToDefault();
  }

  function createTabCategory(name: string) {
    if (!name || categories.includes(name)) {
      return;
    }
    addCategory(name);
    closeCreateOrEditTabCategory();
    //resetAppModeToDefault();
  }

  function resetAppModeToDefault() {
    setCurrentAppMode(undefined);
  }

  function resetLiscControlModeToDefault() {
    setListControlMode(undefined);
  }

  async function createTab() {
    chrome?.tabs?.create({ url: "chrome://newtab/" });
  }
  function searchWeb(url: string) {
    if (!selectedTab?.id) return;
    const searchUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? encodeURIComponent(url)
        : url.startsWith("www.")
        ? `https://${encodeURIComponent(url)}`
        : `https://www.google.com/search?q=${encodeURIComponent(url)}`;

    chrome?.tabs?.update(selectedTab.id, { url: searchUrl });
  }
  function backwardTab() {
    chrome?.tabs?.goBack();
  }
  function forwardTab() {
    chrome?.tabs?.goForward();
  }
  function reloadTab() {
    chrome?.tabs?.reload();
  }

  return (
    <div className="w-full h-full flex flex-col">
      {listControlMode === ListControlMode.search ? (
        <SearchView
          searchText={listControl?.search}
          onSearch={searchTabs}
          onClose={resetLiscControlModeToDefault}
        />
      ) : listControlMode === ListControlMode.sort ? (
        <ListControlView
          selectedOption={listControl?.sort}
          listControlMode={listControlMode}
          options={sortOptions}
          onOptionSelect={sortTabs}
          onClose={resetLiscControlModeToDefault}
        />
      ) : listControlMode === ListControlMode.filter ? (
        <ListControlView
          selectedOption={listControl?.filter}
          listControlMode={listControlMode}
          options={filterOptions}
          onOptionSelect={filterTabs}
          onClose={resetLiscControlModeToDefault}
        />
      ) : listControlMode === ListControlMode.group ? (
        <ListControlView
          selectedOption={listControl?.group}
          listControlMode={listControlMode}
          options={groupOptions}
          onOptionSelect={groupTabs}
          onClose={resetLiscControlModeToDefault}
        />
      ) : (
        <div className="flex items-center justify-between text-xl h-[40px]">
          <ListControlLogoItem title={listControl?.sort}>
            <FaSort onClick={() => setListControlMode(ListControlMode.sort)} />
          </ListControlLogoItem>

          <ListControlLogoItem title={listControl?.filter}>
            <FaFilter
              className="text-lg"
              onClick={() => setListControlMode(ListControlMode.filter)}
            />
          </ListControlLogoItem>

          <ListControlLogoItem title={`${tabs.length} tabs`} isLargeText>
            <h1
              className="font-bold"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              Easy Tabs
            </h1>
          </ListControlLogoItem>

          <ListControlLogoItem title={listControl?.group}>
            <FaLayerGroup
              className="text-lg"
              onClick={() => setListControlMode(ListControlMode.group)}
            />
          </ListControlLogoItem>

          <ListControlLogoItem title={listControl?.search}>
            <FaSearch
              className="text-lg"
              onClick={() => setListControlMode(ListControlMode.search)}
            />
          </ListControlLogoItem>
        </div>
      )}
      <div className="flex-1 flex flex-col gap-4 px-4 py-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <CircleButton
            onClick={() =>
              setTabMode((tabMode) =>
                tabMode == TabMode.grid ? TabMode.list : TabMode.grid
              )
            }
          >
            {tabMode == TabMode.grid ? <IoList /> : <FiGrid />}
          </CircleButton>
          <ClickOutsideView
            onClickOutside={() => {
              if (currentAppMode !== undefined) {
                resetAppModeToDefault();
              }
            }}
          >
            <ul
              className="w-full flex-1 flex items-center gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((category, index) =>
                index === categoryUpdateIndex ? (
                  <TabCategoryInput
                    previousName={category}
                    onSave={(name) => updateTabCategory(category, name)}
                    onClose={closeCreateOrEditTabCategory}
                  />
                ) : (
                  <LongPressButton
                    onLongPress={() =>
                      setCurrentAppMode(AppMode.modifyCategory)
                    }
                  >
                    <TabCategoryItem
                      key={category}
                      isDeleteMode={currentAppMode == AppMode.modifyCategory}
                      selectedCategory={selectedCategory}
                      category={category}
                      onClick={() => openTabCategory(category)}
                      onRemove={() => removeCategory(category, index)}
                      onEdit={() => startEditTabCategory(index)}
                    />
                  </LongPressButton>

                  // <PopupMenuButton
                  //   onRightClickPopup={
                  //     defaultTabCategories.includes(category)
                  //       ? undefined
                  //       : {
                  //           options: categoryOptions,
                  //           onOptionSelect: (option) =>
                  //             executeCategoryOption(option, category, index),
                  //         }
                  //   }
                  // >
                  //   <TabCategoryItem
                  //     key={category}
                  //     isDeleteMode={currentAppMode == AppMode.modifyCategory}
                  //     selectedCategory={selectedCategory}
                  //     category={category}
                  //     onClick={() => openTabCategory(category)}
                  //     onClose={() => closeTabCategory(category)}
                  //   />
                  // </PopupMenuButton>
                )
              )}
              {categoryUpdateIndex === -1 && (
                <TabCategoryInput
                  onSave={createTabCategory}
                  onClose={closeCreateOrEditTabCategory}
                />
              )}
            </ul>
          </ClickOutsideView>

          {currentAppMode === undefined && (
            <CircleButton onClick={startCreateTabCategory}>
              <IoMdAdd />
            </CircleButton>
          )}
        </div>
        <div className="flex-1 h-full w-full flex flex-col gap-2">
          {currentAppMode == AppMode.createTab && (
            <TabInput onSave={createTab} onClose={resetAppModeToDefault} />
          )}
          {tabs.length === 0 && currentAppMode !== AppMode.createTab ? (
            <div className="w-full h-full flex items-center justify-center">
              No tabs
            </div>
          ) : (
            <div
              className="overflow-auto flex-1 flex flex-col w-full h-full"
              style={{ scrollbarWidth: "none" }}
            >
              {listControl?.group !== undefined ? (
                <GroupedTabListView
                  selectedTabId={selectedTab?.id}
                  tabMode={tabMode}
                  tabGroups={tabGroups}
                  onClick={openTab}
                  onOptionSelect={executeTabOption}
                  category={selectedCategory}
                  categories={categories.filter(
                    (category) => !defaultTabCategories.includes(category)
                  )}
                  onCategorySelect={executeAddTabToCategoryOption}
                  thumbnails={thumbnails}
                />
              ) : (
                <TabListView
                  selectedTabId={selectedTab?.id}
                  tabMode={tabMode}
                  tabs={tabs}
                  onClick={openTab}
                  onOptionSelect={executeTabOption}
                  category={selectedCategory}
                  categories={categories.filter(
                    (category) => !defaultTabCategories.includes(category)
                  )}
                  onCategorySelect={executeAddTabToCategoryOption}
                  thumbnails={thumbnails}
                  isFullHeight
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xl px-4 py-2">
        <UrlSearchInput url={selectedTab?.url ?? ""} onSearch={searchWeb} />
        <FaArrowLeft onClick={backwardTab} />
        <FaArrowRight onClick={forwardTab} />
        <FaArrowsRotate onClick={reloadTab} />
        <IoMdAdd className="text-2xl font-bold" onClick={createTab} />
      </div>
    </div>
  );
}

export default App;
