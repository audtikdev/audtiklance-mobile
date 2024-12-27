import { LocationData } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
    location: LocationData | null
}

const initialState: LocationState = {
    location: null
}

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        updateLocation: (state, action: PayloadAction<{location: LocationData}>) => {
            state.location = {...state.location, ...action.payload.location}
        },
        resetLocation: ()=> initialState
    }
})

export const {updateLocation, resetLocation} = locationSlice.actions
export default locationSlice.reducer