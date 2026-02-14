import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import NoteEditModal from "../components/ui/NoteEditModal";
import { noteServices } from "../api/note.services";
import type { Note } from "../types/note";

type Filter = "all" | "active" | "completed";

export default function Dashboard() {
  const user = useSelector(
    (state: {
      userData?: {
        user?: { id: string; fullName: string; email: string } | null;
      };
    }) => state.userData?.user ?? null,
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState<Filter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [editNote, setEditNote] = useState<Note | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [confirmState, setConfirmState] = useState<
    | null
    | { kind: "delete-one"; id: string; title?: string }
    | { kind: "bulk-delete"; ids: string[] }
    | { kind: "delete-completed"; ids: string[] }
  >(null);
  const [isConfirmBusy, setIsConfirmBusy] = useState(false);

  const filteredNotes = useMemo(() => {
    if (filter === "active") return notes.filter((n) => !n.completed);
    if (filter === "completed") return notes.filter((n) => n.completed);
    return notes;
  }, [filter, notes]);

  const completedCount = useMemo(
    () => notes.filter((n) => n.completed).length,
    [notes],
  );

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const data = await noteServices.getNotes();
        if (!isActive) return;
        setNotes(data);
      } catch (error) {
        if (!isActive) return;
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to load notes");
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const toggleCompleted = async (note: Note) => {
    const next = !note.completed;
    setNotes((prev) =>
      prev.map((n) => (n._id === note._id ? { ...n, completed: next } : n)),
    );
    try {
      await noteServices.updateNote(note._id, { completed: next });
    } catch (error) {
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, completed: note.completed } : n,
        ),
      );
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update note");
      } else {
        toast.error("Failed to update note");
      }
    }
  };

  const requestDeleteOne = (note: Note) => {
    setConfirmState({ kind: "delete-one", id: note._id, title: note.title });
  };

  const saveEditModal = async (payload: {
    title: string;
    text?: string;
    tags: string[];
  }) => {
    if (!editNote || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      const res = await noteServices.updateNote(editNote._id, payload);
      setNotes((prev) =>
        prev.map((n) => (n._id === editNote._id ? res.note : n)),
      );
      toast.success("Note updated");
      setEditNote(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update note");
      } else {
        toast.error("Failed to update note");
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const bulkDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setConfirmState({ kind: "bulk-delete", ids: [...selectedIds] });
  };

  const deleteCompleted = async () => {
    if (completedCount === 0) return;
    const ids = notes.filter((n) => n.completed).map((n) => n._id);
    if (ids.length === 0) return;
    setConfirmState({ kind: "delete-completed", ids });
  };

  const confirmTitle =
    confirmState?.kind === "delete-one"
      ? "Delete note?"
      : confirmState?.kind === "bulk-delete"
        ? "Delete selected notes?"
        : confirmState?.kind === "delete-completed"
          ? "Delete completed notes?"
          : "Confirm";

  const confirmDescription =
    confirmState?.kind === "delete-one"
      ? `This will permanently delete “${String(confirmState.title ?? "").trim() || "Untitled"}”.`
      : confirmState?.kind === "bulk-delete"
        ? `This will permanently delete ${confirmState.ids.length} selected note(s).`
        : confirmState?.kind === "delete-completed"
          ? `This will permanently delete ${confirmState.ids.length} completed note(s).`
          : undefined;

  const runConfirmedAction = async () => {
    if (!confirmState || isConfirmBusy) return;

    setIsConfirmBusy(true);
    try {
      if (confirmState.kind === "delete-one") {
        const id = confirmState.id;
        setNotes((prev) => prev.filter((n) => n._id !== id));
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        await noteServices.deleteNote(id);
        toast.success("Note deleted");
      }

      if (confirmState.kind === "bulk-delete") {
        const ids = confirmState.ids;
        setNotes((prev) => prev.filter((n) => !ids.includes(n._id)));
        clearSelection();
        await noteServices.bulkDelete(ids);
        toast.success("Selected notes deleted");
      }

      if (confirmState.kind === "delete-completed") {
        setNotes((prev) => prev.filter((n) => !n.completed));
        setSelectedIds((prev) =>
          prev.filter((id) => {
            const note = notes.find((n) => n._id === id);
            return note ? !note.completed : true;
          }),
        );
        const res = await noteServices.deleteCompleted();
        toast.success(res.message || "Completed notes deleted");
      }

      setConfirmState(null);
    } catch {
      if (confirmState.kind === "delete-one") {
        toast.error("Failed to delete note");
      } else if (confirmState.kind === "bulk-delete") {
        toast.error("Failed to delete selected notes");
      } else {
        toast.error("Failed to delete completed notes");
      }
    } finally {
      setIsConfirmBusy(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Manage notes with tags, completion, and bulk actions."
        />
      </Helmet>

      <ConfirmModal
        open={!!confirmState}
        title={confirmTitle}
        description={confirmDescription}
        confirmText="Delete"
        cancelText="Cancel"
        tone="danger"
        busy={isConfirmBusy}
        onClose={() => {
          if (!isConfirmBusy) setConfirmState(null);
        }}
        onConfirm={runConfirmedAction}
      />

      <NoteEditModal
        open={!!editNote}
        note={editNote}
        busy={isSavingEdit}
        onClose={() => {
          if (!isSavingEdit) setEditNote(null);
        }}
        onSave={saveEditModal}
      />

      <div className="grid gap-6">
        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {user ? `Signed in as ${user.fullName}` : "Signed in"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                className="w-auto"
                disabled={selectedIds.length === 0}
                onClick={bulkDeleteSelected}
              >
                Delete selected ({selectedIds.length})
              </Button>
              <Button
                variant="secondary"
                className="w-auto"
                disabled={completedCount === 0}
                onClick={deleteCompleted}
              >
                Delete completed ({completedCount})
              </Button>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-white/60">
            Modify notes here: edit title/text/tags, mark complete, and delete
            in bulk.
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Notes</h2>
              <p className="mt-1 text-xs text-white/50">{notes.length} total</p>
            </div>

            <div className="inline-flex w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/30 sm:w-auto">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "completed", label: "Completed" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={[
                    "px-3 py-2 text-xs font-semibold transition",
                    filter === item.key
                      ? "bg-slate-950/70 text-white"
                      : "text-white/60 hover:text-white hover:bg-slate-950/40",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 text-sm text-white/60">Loading notes…</div>
          ) : filteredNotes.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-white/60">
              No notes in this view.
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {filteredNotes.map((note) => {
                const isSelected = selectedIds.includes(note._id);

                return (
                  <article
                    key={note._id}
                    className="rounded-xl border border-white/10 bg-slate-950/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <label className="mt-1 inline-flex items-center gap-2 text-xs text-white/60">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(note._id)}
                            className="h-4 w-4"
                          />
                          Select
                        </label>

                        <div>
                          <h3
                            className={[
                              "text-sm font-semibold",
                              note.completed
                                ? "text-white/55 line-through"
                                : "text-white",
                            ].join(" ")}
                          >
                            {note.title}
                          </h3>

                          {(note.tags ?? []).length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {(note.tags ?? []).map((t) => (
                                <span
                                  key={t}
                                  className="rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1 text-[11px] font-semibold text-white/70"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCompleted(note)}
                          className={[
                            "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                            note.completed
                              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                              : "border-white/10 bg-slate-950/40 text-white/70 hover:bg-slate-950/60",
                          ].join(" ")}
                        >
                          {note.completed ? "Completed" : "Mark complete"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditNote(note)}
                          className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-slate-950/60 transition"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => requestDeleteOne(note)}
                          className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/15 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {note.text ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-white/70">
                        {note.text}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-white/40">(No text)</p>
                    )}

                    {note.createdAt ? (
                      <p className="mt-4 text-xs text-white/40">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
