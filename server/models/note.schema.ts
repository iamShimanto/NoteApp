import { model, Schema, type InferSchemaType } from "mongoose";

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
  },
  {
    timestamps: true,
  }
);

type Note = InferSchemaType<typeof noteSchema>;

const NoteModel = model<Note>("Note", noteSchema);

export default NoteModel;
