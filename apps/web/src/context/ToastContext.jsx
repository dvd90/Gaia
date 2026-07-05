import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback(id => {
    setToasts(current => current.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "success", timeout = 3500) => {
      const id = ++nextId;
      setToasts(current => [...current, { id, message, type }]);
      setTimeout(() => dismiss(id), timeout);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map(t => (
          <button
            key={t.id}
            className={`toast toast-${t.type}`}
            onClick={() => dismiss(t.id)}
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
