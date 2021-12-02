import { useState } from "react";

type CounterT = [number, () => void, () => void];

const useCounter = (initialState: number): CounterT => {
  const [counter, setCounter] = useState(initialState);

  const increment = () => {
    setCounter((prev) => prev + 1);
  };

  const decrement = () => {
    setCounter((prev) => prev - 1);
  };

  return [counter, increment, decrement];
};

export default useCounter;
