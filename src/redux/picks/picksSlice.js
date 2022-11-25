import { createSlice } from '@reduxjs/toolkit';

export const picksSlice = createSlice({
    name: 'picks',
    initialState: {
        picks: null,
        allPicks: null,
        sum: null,
        sumPair: null,
        sumOneTwoThree: null,
        combinations: null
    },
    reducers: {
        getPicks: (state, action) => {
            state.picks = action.payload
        },
        getAllPicks: (state, action) => {
            state.allPicks = action.payload
        },
        getSum: (state, action) => {
            state.sum = action.payload
        },
        getCombinations: (state, action) => {
            state.combinations = action.payload
        },
        getSumPair: (state, action) => {
            state.sumPair = action.payload
        },
        getSumOneTwoThree: (state, action) => {
            state.sumOneTwoThree = action.payload
        }

    },
});

export const { getPicks, getSum, getSumPair, getSumOneTwoThree, getCombinations, getAllPicks } = picksSlice.actions;

export const selectPicks = (state) => state.picks.picks?state.picks.picks:null;
export const selectAllPicks = (state) => state.picks.allPicks?state.picks.allPicks:null;
export const selectSum = (state) => state.picks.sum?state.picks.sum:null;
export const selectCombinations = (state) => state.picks.combinations?state.picks.combinations:null;
export const selectSumPair = (state) => state.picks.sumPair?state.picks.sumPair:null;
export const selectSumOneTwoThree = (state) => state.picks.sumOneTwoThree?state.picks.sumOneTwoThree:null;


export default picksSlice.reducer;