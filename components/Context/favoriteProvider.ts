import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteState {
    favorite: Array<string>
}

const initialState: FavoriteState ={
    favorite: []
}

const favoriteSlice = createSlice({
    name: "favorite",
    initialState,
    reducers: {
        updateFavorite: (state, action: PayloadAction<{favorite: Array<string>}>) => {
            state.favorite = action.payload.favorite
        },
        resetFavorite: () => initialState
    }
})

export const {updateFavorite, resetFavorite} = favoriteSlice.actions;
export default favoriteSlice.reducer