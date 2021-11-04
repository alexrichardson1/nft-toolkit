import storeReducer from "reducers/storeReducer";
import { createStore } from "redux";

const store = createStore(storeReducer);

export type StoreStateT = ReturnType<typeof store.getState>;

export type StoreDispatchT = typeof store.dispatch;

export default store;
