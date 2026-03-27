import { RoadMapCreateData } from "../types/user"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function createRoadmap(data: RoadMapCreateData) {
    try {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description || "")
        formData.append("image", data.image)

        const response = await fetch(`${BACKEND_URL}/roadmap/create`, {
            method: "POST",
            body: formData,
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error creating roadmap", err)
        return null
    }
}

export async function getRoadmaps(page: number = 1, limit: number = 10) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error getting roadmaps", err)
        return null
    }
}

export async function saveChanges(roadmapId: string, nodes: any[], edges: any[]) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nodes, edges }),
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error saving changes", err)
        return null
    }
}

export async function getAllRoadmapData(roadmapId: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/all`, {
            method: "GET",
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error getting all roadmap data", err)
        return null
    }
}

export async function getCommunityRoadmaps(page: number = 1, limit: number = 20, tag?: string) {
    try {
        let url = `${BACKEND_URL}/roadmap/community?page=${page}&limit=${limit}`
        if (tag) url += `&tag=${encodeURIComponent(tag)}`
        
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error getting community roadmaps", err)
        return null
    }
}

export async function shareRoadmap(roadmapId: string, isPublic: boolean, tags: string[]) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/share`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_public: isPublic, tags }),
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error sharing roadmap", err)
        return null
    }
}

export async function verifyRoadmap(roadmapId: string, verified: boolean = true) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/verify?verified=${verified}`, {
            method: "PATCH",
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error verifying roadmap", err)
        return null
    }
}
export async function copyRoadmap(roadmapId: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/copy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error copying roadmap", err)
        return null
    }
}

export async function updateRoadmapMetadata(roadmapId: string, title?: string, description?: string, image?: File) {
    try {
        const formData = new FormData()
        if (title) formData.append("title", title)
        if (description !== undefined) formData.append("description", description)
        if (image) formData.append("image", image)

        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/update`, {
            method: "PATCH",
            body: formData,
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error updating roadmap metadata", err)
        return null
    }
}

export async function deleteRoadmap(roadmapId: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}`, {
            method: "DELETE",
            credentials: "include",
        })
        return await response.json()
    } catch (err) {
        console.log("Error deleting roadmap", err)
        return null
    }
}
