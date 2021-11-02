import { FC } from "react";

interface PropsT {
  error: boolean;
}

const GenericFallback: FC<PropsT> = (props) => {
  return <> {props.error ? <>404</> : props.children}</>;
};

export default GenericFallback;
