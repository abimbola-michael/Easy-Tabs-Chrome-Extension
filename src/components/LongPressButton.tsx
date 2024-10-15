import React, { ReactNode, useState } from "react";

export default function LongPressButton({
  onLongPress,
  children,
}: {
  onLongPress: (e?: React.MouseEvent) => void;
  children: ReactNode;
}) {
  const [isLongPress, setIsLongPress] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const longPressDuration = 500; // Define how long the press should last

  // Start the long press timer
  const handleMouseDown = (e) => {
    const timer = window.setTimeout(() => {
      setIsLongPress(true);
      // Trigger the long press action
      onLongPress(e);
    }, longPressDuration);

    setTimerId(timer);
  };

  // Clear the long press timer
  const handleMouseUp = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    setIsLongPress(false);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Ensure it resets if the mouse leaves the button
      onTouchStart={handleMouseDown} // For mobile touch support
      onTouchEnd={handleMouseUp}
    >
      {children}
    </button>
  );
}
