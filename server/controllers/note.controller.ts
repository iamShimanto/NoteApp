import type { RequestHandler } from "express";
import NoteModel from "../models/note.schema.ts";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.userId;
    const notes = await NoteModel.find({ user: id }).select("-user -__v");
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNotes: RequestHandler = async (req, res, next) => {
  try {
    const { title, text } = req.body;

    const newNotes = new NoteModel({
      title,
      text,
      user: req?.user?.userId,
    });
    await newNotes.save();

    res.status(201).send({ notes: newNotes });
  } catch (error) {
    next(error);
  }
};
