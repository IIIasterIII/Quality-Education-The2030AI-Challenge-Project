import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    id: number | null
    firebase_uid: string | null
    email: string | null
    username: string | null
    avatar: string | null
    isLoggedIn: boolean
    loading: boolean
}

const initialState: UserState = {
    id: null,
    firebase_uid: null,
    email: null,
    username: null,
    avatar: null,
    isLoggedIn: false,
    loading: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ id: number; firebase_uid: string; email: string; username: string; avatar: string }>) => {
            state.id = action.payload.id
            state.firebase_uid = action.payload.firebase_uid
            state.email = action.payload.email
            state.username = action.payload.username
            state.avatar = action.payload.avatar
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.id = null
            state.firebase_uid = null
            state.email = null
            state.isLoggedIn = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
})

export const { setUser, logout, setLoading } = userSlice.actions
export default userSlice.reducer