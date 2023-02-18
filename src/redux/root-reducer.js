import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from '../redux/user/userSlice';
import picksReducer from '../redux/picks/picksSlice'
import drawsReducer from '../redux/draws/drawsSlice'
import guessesReducer from '../redux/guesses/guessesSlice'


const persistConfig = {
    key: 'p3',
    storage,
    whitelist: ['user', 'picks', 'draws', 'guesses']
};

const rootReducer = combineReducers({
    user: userReducer,
    picks: picksReducer,
    draws: drawsReducer,
    guesses: guessesReducer
});

export default persistReducer(persistConfig, rootReducer);