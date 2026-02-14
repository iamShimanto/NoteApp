import { api } from ".";
import type { Note, NoteCreatePayload, NoteUpdatePayload } from "../types/note";

export const noteServices = {
  getNotes: async (): Promise<Note[]> => {
    const res = await api.get<Note[]>("/api/notes");
    return res.data;
  },

  createNote: async (payload: NoteCreatePayload): Promise<{ notes: Note }> => {
    const res = await api.post<{ notes: Note }>("/api/notes/create", payload);
    return res.data;
  },

  updateNote: async (
    id: string,
    payload: NoteUpdatePayload,
  ): Promise<{ message: string; note: Note }> => {
    const res = await api.put<{ message: string; note: Note }>(
      `/api/notes/${id}`,
      payload,
    );
    return res.data;
  },

  deleteNote: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/api/notes/${id}`);
    return res.data;
  },

  deleteCompleted: async (): Promise<{
    message: string;
    deletedCount: number;
  }> => {
    const res = await api.delete<{ message: string; deletedCount: number }>(
      "/api/notes/completed",
    );
    return res.data;
  },

  bulkDelete: async (
    ids: string[],
  ): Promise<{ message: string; deletedCount: number }> => {
    const res = await api.post<{ message: string; deletedCount: number }>(
      "/api/notes/bulk-delete",
      { ids },
    );
    return res.data;
  },
};
