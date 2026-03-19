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