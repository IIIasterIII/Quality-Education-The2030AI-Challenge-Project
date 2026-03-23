import { NoteToCreate, NoteToEdit } from "../app/notes/types"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getNotes() {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`, {
            method: "GET",
            credentials: "include",
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error getting notes", err)
        return null
    }
}

export async function createNewNote(data: NoteToCreate) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error creating note", err)
        return null
    }
}

export async function deleteNote(id: number) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes?id=${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        return response.ok
    } catch (err) {
        console.log("Error deleting note", err)
        return false
    }
}

export async function editNote(id: number, data: NoteToEdit) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes?id=${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error editing note", err)
        return null
    }
}

export async function uploadNoteImage(file: File) {
    try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await fetch(`${BACKEND_URL}/notes/upload`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
        if (!response.ok) return null
        return (await response.json()) as { url: string }
    } catch (err) {
        console.log("Error uploading image", err)
        return null
    }
}

export async function createNewSubNote(page_id: string, title: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error creating subnote", err)
        return null
    }
}

export async function getSubNotes(page_id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error getting subnotes", err)
        return null
    }
}