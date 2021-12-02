import { useState } from "react";

interface ArrayI<T> {
  array: T[];
  set: SetStateAction<T[]>;
  push: (elem: T) => void;
  filter: (predicate: (value: T, index: number, array: T[]) => T) => void;
  update: (i: number, elem: T) => void;
  remove: (i: number) => void;
  clear: () => void;
}

function useArray<T>(defaultValue: T[]): ArrayI<T> {
  const [array, setArray] = useState<T[]>(defaultValue);

  function push(element: T) {
    setArray((arr: T[]) => [...arr, element]);
  }

  function filter(predicate: (value: T, index: number, array: T[]) => T) {
    setArray((arr: T[]) => arr.filter(predicate));
  }

  function update(index: number, newElement: T) {
    setArray((arr: T[]) => {
      return [
        ...arr.slice(0, index),
        newElement,
        ...arr.slice(index + 1, arr.length - 1),
      ];
    });
  }

  function remove(index: number) {
    setArray((arr: T[]) => [
      ...arr.slice(0, index),
      ...arr.slice(index + 1, arr.length - 1),
    ]);
  }

  function clear() {
    setArray([]);
  }

  return { array, set: setArray, push, filter, update, remove, clear };
}

export default useArray;
