import { ReactNode, useEffect, useRef, useState } from "react";
import { PopupControlType } from "../enums/enums";
import ClickOutsideView from "../views/ClickOutsideView";
import PopupMenu from "./PopupMenu";

// Define your object type for better clarity
interface PopupMenuObject {
  title?: ReactNode;
  options?: string[];
  onOptionSelect?: (option?: string, index?: number) => void;
  builder?: (option?: string, index?: number) => ReactNode | undefined;
}

export default function PopupMenuButton({
  children,
  onHoverPopup,
  onClickPopup,
  onRightClickPopup,
  offset = 20,
}: {
  children?: ReactNode;
  onHoverPopup?: ReactNode | PopupMenuObject | undefined;
  onClickPopup?: ReactNode | PopupMenuObject | undefined;
  onRightClickPopup?: ReactNode | PopupMenuObject | undefined;
  offset?: number;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

  // const [show, setShow] = useState<boolean>(false);
  const [eventPosition, setEventPosition] = useState<{
    x: number;
    y: number;
  } | null>(undefined);

  const [popupPosition, setPopupPosition] = useState({
    top: false,
    left: false,
  });
  //const [popupControlType, setPopupControlType] = useState<PopupControlType>();
  const popupControlTypeRef = useRef<PopupControlType>();

  // Calculate the popup position when it's rendered
  useEffect(() => {
    if (popupRef.current && eventPosition) {
      const popupRect = popupRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      setPopupPosition({
        top: eventPosition.y + popupRect.height + offset <= viewportHeight,
        left: eventPosition.x + popupRect.width + offset <= viewportWidth,
      });
    }
  }, [eventPosition]);

  function showPopup(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
    popupControlType: PopupControlType
  ) {
    e.preventDefault(); // Prevent default right-click menu
    e.stopPropagation();

    let clientX, clientY;
    if (e.nativeEvent instanceof MouseEvent) {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    }
    popupControlTypeRef.current = popupControlType;

    setEventPosition({ x: clientX, y: clientY });
  }
  function hidePopup() {
    popupControlTypeRef.current = undefined;
    setEventPosition(undefined);
  }
  function togglePopup(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    popupControlType: PopupControlType
  ) {
    if (eventPosition) {
      hidePopup();
    } else {
      showPopup(e, popupControlType);
    }
  }
  // Hide popup when clicking outside
  function handleClickOutside(e: MouseEvent) {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      hidePopup();
    }
  }
  function getPopupView(popup: ReactNode | PopupMenuObject): ReactNode {
    if (!popup) return <></>;
    if (
      typeof popup === "object" &&
      ("title" in popup ||
        "onOptionSelect" in popup ||
        "title" in popup ||
        "builder" in popup)
    ) {
      return (
        <PopupMenu
          title={popup.title}
          options={popup.options}
          onOptionSelect={(option, index) => {
            popup.onOptionSelect(option, index);
            hidePopup();
          }}
          builder={popup.builder}
        />
      );
    }
    return popup as ReactNode;
  }
  return (
    <div
      className="relative"
      onMouseOver={
        onHoverPopup && !eventPosition
          ? (e) => showPopup(e, PopupControlType.hover)
          : undefined
      }
      onMouseLeave={onHoverPopup ? hidePopup : undefined}
      onClick={
        onClickPopup && !eventPosition
          ? (e) => showPopup(e, PopupControlType.leftClick)
          : undefined
      }
      onMouseDown={
        onRightClickPopup && !eventPosition
          ? (e) => {
              if (e.button === 2) {
                e.preventDefault();
                e.stopPropagation();

                showPopup(e, PopupControlType.rightClick);
              }
            }
          : undefined
      }
      // onContextMenu={
      //   onRightClickPopup && !eventPosition
      //     ? (e) => showPopup(e, PopupControlType.rightClick)
      //     : undefined
      // }
    >
      {children}
      {eventPosition && (
        <div
          className={`absolute shadow-lg bg-tint rounded-lg z-10`}
          ref={popupRef}
          style={{
            top: popupPosition.top ? offset : undefined,
            right: !popupPosition.left ? offset : undefined,
            bottom: !popupPosition.top ? offset : undefined,
            left: popupPosition.left ? offset : undefined,
          }}
        >
          <ClickOutsideView onClickOutside={handleClickOutside}>
            {popupControlTypeRef.current === PopupControlType.hover &&
              getPopupView(onHoverPopup)}
            {popupControlTypeRef.current === PopupControlType.leftClick &&
              getPopupView(onClickPopup)}
            {popupControlTypeRef.current === PopupControlType.rightClick &&
              getPopupView(onRightClickPopup)}
          </ClickOutsideView>
        </div>
      )}
    </div>
  );
}
