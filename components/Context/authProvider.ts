import { AuthUser } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    auth: AuthUser
}

const initialState: AuthState ={
    auth: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAuth: (state, action: PayloadAction<{auth: AuthUser}>) => {
            state.auth = {...state.auth, ...action.payload.auth}
        },
        resetAuth: () => initialState
    }
})

export const {updateAuth, resetAuth} = authSlice.actions;
export default authSlice.reducer