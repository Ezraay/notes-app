import { v4 as getID } from 'uuid'

// Object used to represent a single note
export default class Note {
    date: number
    noteID: string

    constructor(public text: string) {
        this.date = Date.now()
        this.noteID = getID()
    }

    edit(text: string) {
        this.text = text
    }
}