import express from 'express'
import { port } from './Constants'
import Note from './Note'
import { v4 as getID } from 'uuid'

const app = express()
const notes: { 
    [index: string]: // index being sessionID
    {[index: string]: Note} } = {} // index being noteID

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static('static'))
app.use(express.urlencoded({ extended: true }))
app.use(require('cookie-parser')())
app.use((req, res, next) => {
    // Ensures the request always has a sessionID and cookie, 
    // and if an unknown cookie is sent, that it is overridden 
    if (!req.cookies.sessionID || !notes[req.cookies.sessionID]) {
        const sessionID = getID()
        res.cookie('sessionID', sessionID)
        req.cookies.sessionID = sessionID
        notes[sessionID] = {}
        console.log(`Set new cookie: ${sessionID}`)
    }
    
    next()
})

app.get('/', (req, res) => {
    // Loads the main page, showing all notes for the current session
    const userNotesData = notes[req.cookies.sessionID]
    const userNotes: Note[] = []
    
    // Convert the dictionary into an array for easy rendering
    Object.keys(userNotesData).forEach(key => {
        userNotes.unshift(userNotesData[key]) // unshift to put in descending order
    })

    const { sessionID } = req.cookies
    res.render('index', { userNotes, sessionID })
})

app.post('/create', (req, res) => {
    // Called when "Save Note" button is clicked
    const { text } = req.body
    const newNote = new Note(text) // Creates a new Note object
    notes[req.cookies.sessionID][newNote.noteID] = newNote

    res.json({ status: 201 })
})

app.post('/delete', (req, res) => {
    // Called when a note is deleted
    const { noteID } = req.body
    delete notes[req.cookies.sessionID][noteID] // Simply removes from dictionary

    res.json({ status: 200 })
})

app.post('/edit', (req, res) => {
    // Called when a note's text is edited
    const { text, noteID } = req.body
    notes[req.cookies.sessionID][noteID].edit(text) // Call the method on Note object

    res.json({ status: 200 })
})

app.listen(port, () => console.log(`Server listening on port ${port}`))