"use client";

import { ReactNode, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 bg-gray-950/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-blue-100 bg-white shadow-2xl shadow-gray-950/15">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-950">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-gray-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-primary"
            aria-label="Tutup"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-blue-100 bg-blue-50/50 px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
