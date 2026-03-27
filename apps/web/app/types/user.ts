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
    is_public?: boolean
    is_verified?: boolean
    tags?: string[]
    owner_username?: string
    owner_avatar?: string
    owner_id?: number
    owner_firebase_uid?: string
}

export interface NodeHandle {
    id: string;
    type: 'source' | 'target';
    position: 'top' | 'bottom' | 'left' | 'right';
}

export interface NodeData { 
    label: string;
    description: string | null;
    isCompleted: boolean;
    customHandles?: NodeHandle[];
}