import { MatchQuestionType } from "@prisma/client";
import { ScoreBoard } from "../components/ui/form/score-board";
import { BoolInput } from "../components/ui/form/bool-input";
import { CounterInput } from "../components/ui/form/counter-input";
import { FormInput } from "../components/ui/form/form-input";
import { SelectInput } from "../components/ui/form/select-input";
import { Answer } from "../types/form-types";
import { GamepieceInput } from "@components/ui/form/charged-up/gamepiece";
import { FieldInput } from "@components/ui/form/charged-up/field-input";
import { DefenseInput } from "@components/ui/form/defense-input";

export function renderDesiredQuestionDisplay(
  questionType: MatchQuestionType,
  label: string,
  options?: string[]
) {
  switch (questionType) {
    case "SCORE":
      return <ScoreBoard label={label} id="" />;
    case "BOOL":
      return <BoolInput label={label} id="" />;
    case "COUNTER":
      return <CounterInput label={label} id="" />;
    case "INPUT":
      return <FormInput label={label} id="" />;
    case "SELECT":
      return <SelectInput label={label} id="" options={options} />;
    case "GAMEPIECE_INFO":
      return <GamepieceInput label={label} id="" />;
    case "FIELD":
      return <FieldInput label={label} id="" />;
    case "DEFENSE":
      return <DefenseInput label={label} id="" />;
  }
}

export function renderFormQuestion(
  questionType: MatchQuestionType,
  label: string,
  id: string,
  updateState: (answer: Answer) => void,
  options?: string[]
) {
  switch (questionType) {
    case "SCORE":
      return <ScoreBoard label={label} id={id} updateState={updateState} />;
    case "BOOL":
      return <BoolInput label={label} id={id} updateState={updateState} />;
    case "COUNTER":
      return <CounterInput label={label} id={id} updateState={updateState} />;
    case "INPUT":
      return <FormInput label={label} id={id} updateState={updateState} />;
    case "SELECT":
      return (
        <SelectInput
          label={label}
          id={id}
          options={options}
          updateState={updateState}
        />
      );
    case "GAMEPIECE_INFO":
      return <GamepieceInput label={label} id={id} updateState={updateState} />;
    case "FIELD":
      return <FieldInput label={label} id={id} updateState={updateState} />;
    case "DEFENSE":
      return <DefenseInput label={label} id={id} updateState={updateState} />;
  }
}
