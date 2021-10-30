import { TypedUseSelectorHook, useSelector } from "react-redux";
import { StoreStateT } from "store/store";

export const useAppSelector: TypedUseSelectorHook<StoreStateT> = useSelector;
