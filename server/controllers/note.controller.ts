import type { RequestHandler } from "express";
import NoteModel from "../models/note.schema.ts";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
