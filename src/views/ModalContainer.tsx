import React, { ReactNode } from "react";
import ClickOutsideView from "./ClickOutsideView";

export default function ModalContainer({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <ClickOutsideView onClickOutside={onClose}>
      <div className="w-full h-full bg-off-tint-lightest fixed py-10 px-8 flex flex-col items-center justify-center">
        <div className="shadow-lg rounded-xl p-4 bg-tint-lightest bg-white">
          {children}
        </div>
      </div>
    </ClickOutsideView>
  );
}
