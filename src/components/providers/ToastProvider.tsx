"use client";

import { Toast, type ToastMessage } from "primereact/toast";
import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { BOOK_TOAST_LIFE_MS } from "@/constants/books-admin";

type ShowToast = (message: Pick<ToastMessage, "severity" | "summary" | "detail">) => void;

const ToastContext = createContext<ShowToast | null>(null);

/**
 * One toast region for the whole shell, so a screen can save, navigate away and still confirm it:
 * "Book added" is shown on the list the form sends the user back to.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useRef<Toast>(null);
  const show = useCallback<ShowToast>((message) => {
    toast.current?.show({ life: BOOK_TOAST_LIFE_MS, ...message });
  }, []);
  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toast} position="bottom-right" />
      {children}
    </ToastContext.Provider>
  );
}

/** Show a toast from any client component inside the shell */
export function useToast(): ShowToast {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}
