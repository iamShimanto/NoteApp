import type { RequestHandler } from "express";
import NoteModel from "../models/note.schema.ts";
import { Types } from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.userId;
    const notes = await NoteModel.find({ user: id }).select("-user -__v");
    res.status(200).send(notes);
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

export const getSingleNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id && !Types.ObjectId.isValid(id)) {
      res.status(400).send({ message: "Failed to fetch note" });
    }

    const note = await NoteModel.findById(id);
    if (!note) {
      res.status(404).send({ message: "Note not found" });
    }
    res.status(200).send(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, text } = req.body;

    if (id && !Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid note" });
    }

    const updateNote = await NoteModel.findByIdAndUpdate(id, {
      title,
      text,
    });
    await updateNote?.save();

    if (!updateNote) {
      return res.status(400).send({ message: "Unable to find note" });
    }

    res
      .status(200)
      .send({ message: "Note updated Successfully", note: updateNote });
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && !Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Note Id" });
    }

    const deleteNote = await NoteModel.findByIdAndDelete(id);

    if (!deleteNote) {
      return res.status(400).send({ messge: "Failed to delete note" });
    }

    res.status(200).send({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};
