import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    uid: string | null
    email: string | null
    isLoggedIn: boolean
}

const initialState: UserState = {
    uid: null,
    email: null,
    isLoggedIn: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ uid: string; email: string }>) => {
            state.uid = action.payload.uid
            state.email = action.payload.email
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.uid = null
            state.email = null
            state.isLoggedIn = false
        },
    },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer