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

export async function getSingleNote(id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
            method: "GET",
            credentials: "include",
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error getting note", err)
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

export async function uploadPDF(file: File) {
    try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await fetch(`${BACKEND_URL}/ingestion/pdf`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error uploading PDF", err)
        return null
    }
}

export async function refineNoteContent(content: string, onChunk: (chunk: string) => void) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/refine?content=${encodeURIComponent(content)}`, {
            method: 'POST',
            credentials: 'include',
        })
        if (!response.ok) return null
        
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        if (!reader) return null

        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            onChunk(chunk)
        }
    } catch (err) {
        console.log("Error refining note", err)
    }
}

export async function createNewSubNote(page_id: string, title: string, content?: any) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error creating subnote", err)
        return null
    }
}

export async function editSubNote(page_id: string, subnote_id: string, title?: string, content?: any, summary?: string) {
    const data = { title, content, summary }
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes/${subnote_id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error editing subnote", err)
        return null
    }
}

export async function generateSubNoteSummary(page_id: string, subnote_id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes/${subnote_id}/generate-summary`, {
            method: "POST",
            credentials: "include",
        })
        if (!response.ok) return null
        
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        if (!reader) return null
        let result = ""
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += decoder.decode(value)
        }
        return JSON.parse(result)
    } catch (err) {
        console.log("Error generating subnote summary", err)
        return null
    }
}

export async function getSingleSubNote(page_id: string, subnote_id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes/${subnote_id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error getting subnote", err)
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

export async function deleteSubNote(page_id: string, subnote_id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${page_id}/subnotes/${subnote_id}`, {
            method: "DELETE",
            credentials: "include",
        })
        return response.ok
    } catch (err) {
        console.log("Error deleting subnote", err)
        return false
    }
}

export async function getGraphData() {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/graph`, {
            method: "GET",
            credentials: "include",
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error getting graph data", err)
        return null
    }
}

export async function generateExercise(note_id: string, level: string, type: string, onChunk: (chunk: string) => void) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${note_id}/generate-exercise?level=${level}&type=${type}`, {
            method: "POST",
            credentials: "include",
        })
        if (!response.ok) return null
        
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        if (!reader) return null

        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            onChunk(chunk)
        }
    } catch (err) {
        console.log("Error generating exercise", err)
    }
}

export async function generateRandomExercise(topic: string, level: string, onChunk: (chunk: string) => void) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/generate-random-exercise?topic=${encodeURIComponent(topic)}&level=${level}`, {
            method: "POST",
            credentials: "include",
        })
        if (!response.ok) return null
        
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        if (!reader) return null

        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            onChunk(chunk)
        }
    } catch (err) {
        console.log("Error generating random exercise", err)
    }
}

export async function updateNoteStats(id: string, data: { time_spent?: number, last_opened?: string, complexity?: string }) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${id}/stats`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.log("Error updating note stats", err)
        return null
    }
}

export async function generateNoteSummary(id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${id}/generate-summary`, {
            method: "POST",
            credentials: "include",
        })
        if (!response.ok) return null
        
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        if (!reader) return null

        let result = ""
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += decoder.decode(value)
        }
        return JSON.parse(result)
    } catch (err) {
        console.log("Error generating summary", err)
        return null
    }
}