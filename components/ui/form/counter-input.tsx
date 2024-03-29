import { Container } from "../container";
import { Answer } from "../../../types/form-types";
import { useState } from "react";
import { MatchFormInput } from "../../../types/misc-types";

export const CounterInput: React.FC<MatchFormInput> = ({
  label,
  id,
  updateState,
}) => {
  const [counter, setCounter] = useState(0);

  const updateFormState = (count: number) => {
    if (updateState) {
      updateState({
        questionId: id,
        slot1: count.toString(),
      });
    }
  };

  return (
    <div className="my-2">
      <Container>
        <label className="p-2 text-lg font-semibold leading-tight border rounded shadow bg-slate-200 dark:bg-zinc-900 dark:border-zinc-600 focus:outline-none focus:shadow-outline">
          {label}
        </label>
        <div className="flex items-center text-lg font-medium leading-tight text-white border rounded shadow dark:bg-zinc-700 dark:border-zinc-800 focus:outline-none focus:shadow-outline justify-evenly">
          <h1
            className="flex items-center justify-center w-full h-full px-4 text-center bg-red-400 hover:cursor-pointer border-slate-300 dark:border-zinc-600"
            onClick={() => {
              setCounter(counter - 1);
              updateFormState(counter-1);
            }}
          >
            -
          </h1>
          <h1 className="flex items-center justify-center h-full px-10 text-center bg-yellow-500 border-l-2 border-r-2 border-slate-300 dark:border-zinc-600">
            {counter}
          </h1>
          <h1
            className="flex items-center justify-center w-full h-full px-4 text-center bg-green-400 rounded-r-lg hover:cursor-pointer border-slate-600 dark:border-zinc-600"
            onClick={() => {
              setCounter(counter + 1);
              updateFormState(counter+1);
            }}
          >
            +
          </h1>
        </div>
      </Container>
    </div>
  );
};
