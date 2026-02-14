import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { noteServices } from "../api/note.services";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { Note } from "../types/note";

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tagsText, setTagsText] = useState("");

  const canCreate = useMemo(() => title.trim().length > 0, [title]);

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

  const parseTags = (value: string): string[] => {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t, index, arr) => arr.indexOf(t) === index)
      .slice(0, 20);
  };

  const createNote = async () => {
    if (!canCreate) return;
    setIsCreating(true);
    try {
      const res = await noteServices.createNote({
        title: title.trim(),
        text: text.trim() || undefined,
        tags: parseTags(tagsText),
      });
      setNotes((prev) => [res.notes, ...prev]);
      setTitle("");
      setText("");
      setTagsText("");
      toast.success("Note created");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create note");
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create note</title>
        <meta
          name="description"
          content="Create a note and view your recent notes."
        />
      </Helmet>

      <div className="grid gap-6">
        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Home
              </p>
              <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white">
                Create a note
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Create here. Edit, complete, and bulk-delete in the dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Open dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Input
              label="Title"
              placeholder="e.g. Sprint retro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Tags (comma separated)"
              placeholder="work, ideas"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              helperText="Up to 20 tags"
            />

            <div className="w-full">
              <label className="mb-1.5 block text-xs font-semibold text-white/80">
                Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write something…"
                rows={5}
                className={[
                  "w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition",
                  "focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400/40",
                ].join(" ")}
              />
              <p className="mt-1.5 text-xs text-white/50">Optional.</p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={createNote}
                isLoading={isCreating}
                disabled={!canCreate}
                className="w-auto"
              >
                Create note
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent notes</h2>
            <p className="text-xs text-white/50">{notes.length} total</p>
          </div>

          {isLoading ? (
            <div className="mt-4 text-sm text-white/60">Loading…</div>
          ) : notes.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-white/60">
              No notes yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {notes.slice(0, 8).map((note) => (
                <article
                  key={note._id}
                  className="rounded-xl border border-white/10 bg-slate-950/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
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

                    {note.completed ? (
                      <span className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                        Completed
                      </span>
                    ) : (
                      <span className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-white/60">
                        Active
                      </span>
                    )}
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
              ))}

              <div className="pt-1">
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold text-white/80 hover:underline"
                >
                  Manage all notes in dashboard →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
