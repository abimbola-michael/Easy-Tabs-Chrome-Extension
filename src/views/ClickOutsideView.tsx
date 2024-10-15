import React, { ReactNode, useEffect } from "react";

export default function ClickOutsideView({
  children,
  onClickOutside,
}: {
  children: ReactNode;
  onClickOutside: (e: MouseEvent) => void;
}) {
  // Add event listener for detecting outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);
  return <div className="w-full">{children}</div>;
}
