const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")

//@desc Get all notes
//@route GET /notes 
//@access Private

const getAllNotes = asyncHandler( async (req,res) =>{
    const notes = await Note.find().lean().exec()

    // If no notes
    if(!notes?.length){
        return res.status(404).json({ message: "No notes found"})  
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})

//@desc create a new note
//@route POST /notes
//@access Private

const createNewNote = asyncHandler( async (req,res) => {
    const { username , title , text } = req.body

    // Confirm data
    if(!username || !title || !text){
        return res.status(400).json({ message: "All fields are required"})
    }

    // Check for duplicate
    const duplicate = await Note.findOne({ title}).lean().exec()

    if(duplicate){
        return res.status(400).json({ message: "Note title already exists"})
    }

    // Create and store the new user
    const note = await Note.create({ username , title , text , completed: false})

    if(note){ //created
        return res.status(201).json({message: "New note created"})
    }
    else{
        return res.status(400).json({ message: "Invalid note data received"})
    }
})


//@desc update a note
//@route PATCH /notes
//@access Private

const updateNote = asyncHandler( async (req,res) => {
    const { id , username , title , text , completed } = req.body

    // Confirm data
    if(!id || !username || !title || !text || typeof completed !== "boolean"){
        return res.status(400).json({ message: "All fields are required"})
    }

    // Does the note exist to update
    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({ message: "Note not found"})
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title}).lean().exec()

    // Allow renaming of the original note
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: "Note title already exists"})
    }

    note.username = username
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    if(updatedNote){
        return res.status(200).json({message: "Note updated"})
    }
    else{
        return res.status(400).json({ message: "Invalid note data received"})
    }
})


//@desc delete a note
//@route DELETE /notes
//@access Private

const deleteNote = asyncHandler( async (req,res) => {
    const { id } = req.body

    // Confirm data
    if(!id){
        return res.status(400).json({ message: "Note ID required"})
    }

    // Does the note exist to delete
    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({ message: "Note not found"})
    }

    const result = await note.deleteOne()

    const reply = `Note ${result.title} with ID ${result._id} deleted`

    res.json(reply)
})
    

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}