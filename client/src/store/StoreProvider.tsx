import { Provider } from "react-redux";
import store from "./store";

const StoreProvider = (props: ProviderPropsI): JSX.Element => {
  return <Provider store={store}>{props.children}</Provider>;
};

export default StoreProvider;
