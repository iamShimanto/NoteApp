import { Button } from "./Button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "default",
  busy = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmVariant = tone === "danger" ? "danger" : "primary";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-[92vw] max-w-md rounded-2xl border border-white/10 bg-slate-950/90 p-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? (
            <p className="text-sm text-white/60">{description}</p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Working…" : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
