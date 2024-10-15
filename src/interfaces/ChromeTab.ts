export const generatedTabs: ChromeTab[] = Array.from(
  { length: 100 },
  (_, index) => {
    return {
      url: "www.facebook.com",
      title: "Facebook",
      index: index,
      id: index,
      pinned: false,
      highlighted: false,
      discarded: false,
      selected: false,
      windowId: 0,
      active: false,
      incognito: false,
      autoDiscardable: false,
      groupId: 0,
    };
  }
);
export const tempTabs: ChromeTab[] = [
  {
    url: "www.facebook.com",
    title: "Facebook",
    index: 0,
    id: 0,
    pinned: false,
    highlighted: false,
    discarded: false,
    selected: false,
    windowId: 0,
    active: false,
    incognito: false,
    autoDiscardable: false,
    groupId: 0,
  },
  {
    url: "www.instagram.com",
    title: "Instagram",
    index: 1,
    id: 1,
    pinned: false,
    highlighted: false,
    discarded: false,
    selected: false,
    windowId: 0,
    active: false,
    incognito: false,
    autoDiscardable: false,
    groupId: 0,
  },
  {
    url: "www.twitter.com",
    title: "Twitter",
    index: 2,
    id: 2,
    pinned: false,
    highlighted: false,
    discarded: false,
    selected: false,
    windowId: 0,
    active: false,
    incognito: false,
    autoDiscardable: false,
    groupId: 0,
  },

  {
    url: "www.tiktok.com",
    title: "Tiktok",
    index: 3,
    id: 3,
    pinned: false,
    highlighted: false,
    discarded: false,
    selected: false,
    windowId: 0,
    active: false,
    incognito: false,
    autoDiscardable: false,
    groupId: 0,
  },

  {
    url: "www.snapchat.com",
    title: "Snapchat",
    index: 4,
    id: 4,
    pinned: false,
    highlighted: false,
    discarded: false,
    selected: false,
    windowId: 0,
    active: false,
    incognito: false,
    autoDiscardable: false,
    groupId: 0,
  },
];

export interface ChromeTab {
  //favorite: boolean;
  /**
   * Optional.
   * Either loading or complete.
   */
  status?: string | undefined;
  /** The zero-based index of the tab within its window. */
  index: number;
  /**
   * Optional.
   * The ID of the tab that opened this tab, if any. This property is only present if the opener tab still exists.
   * @since Chrome 18
   */
  openerTabId?: number | undefined;
  /**
   * Optional.
   * The title of the tab. This property is only present if the extension's manifest includes the "tabs" permission.
   */
  title?: string | undefined;
  /**
   * Optional.
   * The URL the tab is displaying. This property is only present if the extension's manifest includes the "tabs" permission.
   */
  url?: string | undefined;
  /**
   * The URL the tab is navigating to, before it has committed.
   * This property is only present if the extension's manifest includes the "tabs" permission and there is a pending navigation.
   * @since Chrome 79
   */
  pendingUrl?: string | undefined;
  /**
   * Whether the tab is pinned.
   * @since Chrome 9
   */
  pinned: boolean;
  /**
   * Whether the tab is highlighted.
   * @since Chrome 16
   */
  highlighted: boolean;
  /** The ID of the window the tab is contained within. */
  windowId: number;
  /**
   * Whether the tab is active in its window. (Does not necessarily mean the window is focused.)
   * @since Chrome 16
   */
  active: boolean;
  /**
   * Optional.
   * The URL of the tab's favicon. This property is only present if the extension's manifest includes the "tabs" permission. It may also be an empty string if the tab is loading.
   */
  favIconUrl?: string | undefined;
  /**
   * Optional.
   * The ID of the tab. Tab IDs are unique within a browser session. Under some circumstances a Tab may not be assigned an ID, for example when querying foreign tabs using the sessions API, in which case a session ID may be present. Tab ID can also be set to chrome.tabs.TAB_ID_NONE for apps and devtools windows.
   */
  id?: number | undefined;
  /** Whether the tab is in an incognito window. */
  incognito: boolean;
  /**
   * Whether the tab is selected.
   * @deprecated since Chrome 33. Please use tabs.Tab.highlighted.
   */
  selected: boolean;
  /**
   * Optional.
   * Whether the tab has produced sound over the past couple of seconds (but it might not be heard if also muted). Equivalent to whether the speaker audio indicator is showing.
   * @since Chrome 45
   */
  audible?: boolean | undefined;
  /**
   * Whether the tab is discarded. A discarded tab is one whose content has been unloaded from memory, but is still visible in the tab strip. Its content gets reloaded the next time it's activated.
   * @since Chrome 54
   */
  discarded: boolean;
  /**
   * Whether the tab can be discarded automatically by the browser when resources are low.
   * @since Chrome 54
   */
  autoDiscardable: boolean;
  /**
   * Optional.
   * Current tab muted state and the reason for the last state change.
   * @since Chrome 46
   */
  // mutedInfo?: MutedInfo | undefined;
  /**
   * Optional. The width of the tab in pixels.
   * @since Chrome 31
   */
  width?: number | undefined;
  /**
   * Optional. The height of the tab in pixels.
   * @since Chrome 31
   */
  height?: number | undefined;
  /**
   * Optional. The session ID used to uniquely identify a Tab obtained from the sessions API.
   * @since Chrome 31
   */
  sessionId?: string | undefined;
  /**
   * The ID of the group that the tab belongs to.
   * @since Chrome 88
   */
  groupId: number;
  /**
   * The last time the tab was accessed as the number of milliseconds since epoch.
   * @since Chrome 121
   */
  lastAccessed?: number | undefined;
  groupTabs?: ChromeTab[];
  visitsCount?: number;
  categories?: string[];
}

export interface ThumbnailObject {
  id: number;
  title: string;
  thumbnail: string;
}
