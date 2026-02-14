import type { RequestHandler } from "express";
import NoteModel from "../models/note.schema";
import { Types } from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.userId;

    const notes = await NoteModel.find({ user: id })
      .select("-user -__v")
      .sort({ createdAt: -1 });

    res.status(200).send(notes);
  } catch (error) {
    next(error);
  }
};

export const createNotes: RequestHandler = async (req, res, next) => {
  try {
    const { title, text, tags } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).send({ message: "Title is required" });
    }

    const normalizedTags: string[] = Array.isArray(tags)
      ? tags
          .filter((t) => typeof t === "string")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 20)
      : [];

    const newNotes = new NoteModel({
      title: title.trim(),
      text,
      tags: normalizedTags,
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
      return res.status(400).send({ message: "Failed to fetch note" });
    }

    const note = await NoteModel.findOne({ _id: id, user: req.user?.userId });
    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }
    res.status(200).send(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, text, tags, completed } = req.body;

    if (id && !Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid note" });
    }

    const update: Record<string, unknown> = {};
    if (typeof title === "string") update.title = title.trim();
    if (typeof text === "string" || text === null) update.text = text;
    if (typeof completed === "boolean") update.completed = completed;
    if (Array.isArray(tags)) {
      update.tags = tags
        .filter((t) => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 20);
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).send({ message: "No fields to update" });
    }

    const updatedNote = await NoteModel.findOneAndUpdate(
      { _id: id, user: req.user?.userId },
      { $set: update },
      { new: true },
    ).select("-user -__v");

    if (!updatedNote)
      return res.status(404).send({ message: "Note not found" });

    res
      .status(200)
      .send({ message: "Note updated Successfully", note: updatedNote });
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

    const deleteNote = await NoteModel.findOneAndDelete({
      _id: id,
      user: req.user?.userId,
    });

    if (!deleteNote) {
      return res.status(400).send({ messge: "Failed to delete note" });
    }

    res.status(200).send({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteCompletedNotes: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const result = await NoteModel.deleteMany({
      user: userId,
      completed: true,
    });
    res
      .status(200)
      .send({
        message: "Completed notes deleted",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteNotes: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { ids } = req.body as { ids?: unknown };

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({ message: "ids are required" });
    }

    const validIds = ids
      .filter((v) => typeof v === "string")
      .filter((v) => Types.ObjectId.isValid(v));

    if (validIds.length === 0) {
      return res.status(400).send({ message: "No valid ids provided" });
    }

    const result = await NoteModel.deleteMany({
      user: userId,
      _id: { $in: validIds },
    });

    res
      .status(200)
      .send({ message: "Notes deleted", deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};
