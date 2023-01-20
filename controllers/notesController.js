const asyncHandler = require('express-async-handler');

const User = require('./../models/User');
const Note = require('./../models/Note');

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    return res.status(404).json({ message: 'Notes not found' });
  }

  // Adding username to each note before sending the response
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();

      return { ...note, username: user.username };
    })
  );
  res.status(200).json({ notes: notesWithUser });
});
// const GetNote = asyncHandler(async (req, res) => {});
const createNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const note = await Note.create({ user, title, text });
  if (!note) {
    return res
      .status(400)
      .json({ message: 'failed to create a note, Please try again later!' });
  }
  res.status(201).json({ note });
});
const updateNote = asyncHandler(async (req, res) => {
  const { id, user: userId, title, text, completed } = req.body;
  if (!id || !userId || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are require' });
  }

  // check the user id is currect or not
  const user = await User.findById(userId).exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `user not found with the ID ${userId}` });
  }

  // check the note id
  const note = await Note.findById(id).exec();
  if (!note) {
    return res
      .status(400)
      .json({ message: `note not found with the ID $${id}` });
  }

  note.user = userId;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res.status(200).json({ message: `Note ID ${id} was updated successfully` });
});
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: `Note id is required` });
  }

  const note = await Note.findById(id).lean().exec();
  if (note?.length) {
    return res.status(404).json({ message: `Note not found` });
  }

  const result = await Note.findByIdAndDelete(id);
  const reply = `Note title: ${result.title} with id ${result._id} was deleted`;

  res.status(200).json({ message: reply });
});

module.exports = { getAllNotes, createNote, updateNote, deleteNote };
