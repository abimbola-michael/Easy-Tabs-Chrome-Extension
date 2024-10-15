import React, { useEffect, useState } from "react";
import { ChromeTab, ThumbnailObject } from "../interfaces/ChromeTab";

export default function TabDetailsView({
  tab,
  thumbnails,
}: {
  tab: ChromeTab;
  thumbnails: ThumbnailObject[];
}) {
  function getFavicon(url: string) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}/favicon.ico`;
    } catch (error) {
      return null;
    }
  }
  function getThumbnail() {
    const thumbnailObj = thumbnails.find(
      (thumbnailObj) => thumbnailObj.id === tab.id
    );
    return thumbnailObj?.thumbnail ?? tab.favIconUrl;
  }
  const thumbnail = getThumbnail();

  return (
    <div className="w-[200px] flex flex-col rounded-md z-20 bg-tint">
      <div className="flex flex-col items-start gap-[2px] px-4 py-2 bg-tint-lightest rounded-t-md">
        <h2 className="font-bold text-sm text-nowrap text-ellipsis w-0">
          {tab.title || tab.url}
        </h2>
        <p className="text-xs text-nowrap text-ellipsis w-0">{tab.url}</p>
      </div>
      {thumbnail && (
        <div className="w-full h-[100px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={thumbnail}
            alt="Tab thumbnail"
          />
        </div>
      )}
    </div>
  );
}
