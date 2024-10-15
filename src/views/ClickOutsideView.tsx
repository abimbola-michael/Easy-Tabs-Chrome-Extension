import React, { ReactNode, useEffect } from "react";

export default function ClickOutsideView({
  children,
  listen = true,
  onClickOutside,
}: {
  children: ReactNode;
  listen?: boolean;
  onClickOutside: (e: MouseEvent) => void;
}) {
  // Add event listener for detecting outside clicks
  useEffect(() => {
    if (listen) document.addEventListener("mousedown", onClickOutside);
    return () => {
      if (listen) document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);
  return <div className="w-full">{children}</div>;
}
