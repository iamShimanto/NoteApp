import { model, Schema, Types, type InferSchemaType } from "mongoose";

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

type Note = InferSchemaType<typeof noteSchema>;

const NoteModel = model<Note>("Note", noteSchema);

export default NoteModel;
