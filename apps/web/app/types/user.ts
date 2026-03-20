export interface UserData {
    id: number | null
    firebase_uid: string | null
    email: string | null
    username: string | null
    avatar: string | null
    isLoggedIn: boolean
    loading: boolean
}

export interface RoadMapCreateData {
    title: string
    description: string
    image: File
}

export interface RoadMap {
    id: number
    title: string
    description: string
    image_url: string
}

export interface NodeData { 
    label: string;
    description: string | null;
    isCompleted: boolean;
}