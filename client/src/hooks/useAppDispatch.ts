import { ProgressActionI } from "actions/progressActions";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { StoreDispatchT } from "store/store";

const useAppDispatch = (): Dispatch<ProgressActionI> =>
  useDispatch<StoreDispatchT>();

export default useAppDispatch;
