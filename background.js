chrome.tabs.onCreated.addListener(() => {
  console.log("New tab opened");
});

chrome.tabs.onRemoved.addListener(() => {
  console.log("Tab closed");
});
