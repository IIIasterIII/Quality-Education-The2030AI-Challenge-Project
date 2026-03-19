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