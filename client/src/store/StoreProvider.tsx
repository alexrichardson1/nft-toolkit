import { Provider } from "react-redux";
import store from "./store";

const StoreProvider = ({ children }: ProviderPropsI): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
