import React from "react";
import ModalContainer from "./ModalContainer";

interface ConfirmationAction {
  title: string;
  onClick: () => void;
  isDestructive?: boolean;
}
export default function ComfirmationDialog({
  title,
  message,
  actions,
  onClose,
}: {
  title: string;
  message?: string;
  actions?: ConfirmationAction[];
  onClose?: () => void;
}) {
  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-sm font-bold">{title}</h2>
        {message && <p className="text-xs">{message}</p>}
        <ul className="flex items-center gap-3">
          {actions?.map((action) => {
            return (
              <button
                className={`flex-1 px-4 py-3 rounded-full ${
                  action.isDestructive || action.title === "No"
                    ? "bg-red-600 text-white"
                    : "bg-off-tint text-off-tint"
                }`}
                onClick={action.onClick}
              >
                {action.title}
              </button>
            );
          })}
        </ul>
      </div>
    </ModalContainer>
  );
}
