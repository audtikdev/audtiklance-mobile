import { RegisterProvider } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProviderRegisterState {
    provider: RegisterProvider
}

const initialState: ProviderRegisterState ={
    provider: {}
}

const registerProviderSlice = createSlice({
    name: "registerProvider",
    initialState,
    reducers: {
        updateRegisterProvider: (state, action: PayloadAction<{provider: RegisterProvider}>) => {
            state.provider = {...state.provider, ...action.payload.provider}
        },
        resetRegisterProvider: () => initialState
    }
})

export const {updateRegisterProvider, resetRegisterProvider} = registerProviderSlice.actions;
export default registerProviderSlice.reducer