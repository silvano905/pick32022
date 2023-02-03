import { createSlice } from '@reduxjs/toolkit';

export const drawsSlice = createSlice({
    name: 'draws',
    initialState: {
        draws: null
    },
    reducers: {
        getDraws: (state, action) => {
            state.draws = action.payload
        }

    },
});

export const { getDraws } = drawsSlice.actions;

export const selectDraws = (state) => state.draws.draws?state.draws.draws:null;



export default drawsSlice.reducer;