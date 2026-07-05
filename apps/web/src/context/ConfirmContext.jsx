import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ConfirmContext = createContext(null);

// Promise-based confirm dialog: const ok = await confirm({title, text})
export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(
    ({ title, text = "", confirmLabel = "Yes, do it", danger = false }) =>
      new Promise(resolve => {
        setDialog({ title, text, confirmLabel, danger, resolve });
      }),
    []
  );

  const close = result => {
    dialog.resolve(result);
    setDialog(null);
  };

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog && (
        <div className="modal-backdrop" onClick={() => close(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={dialog.title}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="modal-title">{dialog.title}</h3>
            {dialog.text && <p className="modal-text">{dialog.text}</p>}
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => close(false)}>
                Cancel
              </button>
              <button
                className={`btn ${dialog.danger ? "btn-danger" : "btn-primary"}`}
                onClick={() => close(true)}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ctx;
};
