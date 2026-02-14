import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import type { Note } from "../../types/note";

type NoteEditModalProps = {
  open: boolean;
  note: Note | null;
  busy?: boolean;
  onClose: () => void;
  onSave: (payload: { title: string; text?: string; tags: string[] }) => void;
};

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t, index, arr) => arr.indexOf(t) === index)
    .slice(0, 20);
}

export default function NoteEditModal({
  open,
  note,
  busy = false,
  onClose,
  onSave,
}: NoteEditModalProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tagsText, setTagsText] = useState("");

  const noteId = note?._id ?? "";
  const header = useMemo(() => {
    const t = String(note?.title ?? "").trim();
    return t ? `Edit: ${t}` : "Edit note";
  }, [note?.title]);

  useEffect(() => {
    if (!open) return;
    setTitle(String(note?.title ?? ""));
    setText(String(note?.text ?? ""));
    setTagsText((note?.tags ?? []).join(", "));
  }, [open, noteId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={header}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-[92vw] max-w-2xl rounded-2xl border border-white/10 bg-slate-950/90 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{header}</h2>
            <p className="mt-1 text-sm text-white/60">
              Update title, text and tags.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-auto"
            disabled={busy}
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        <div className="mt-4 grid gap-3">
          <Input
            label="Title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <Input
            label="Tags (comma separated)"
            value={tagsText}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTagsText(e.target.value)
            }
          />

          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold text-white/80">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className={[
                "w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition",
                "focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400/40",
              ].join(" ")}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-auto"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-auto"
            disabled={busy}
            isLoading={busy}
            onClick={() => {
              const nextTitle = title.trim();
              if (!nextTitle) return;
              onSave({
                title: nextTitle,
                text: text.trim() || undefined,
                tags: parseTags(tagsText),
              });
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
