import { renderFormQuestion } from "../../../util/render-question-model";
import { Answer } from "../../../types/form-types";
import React from "react";
import { EntryFormType } from "../../../types/misc-types";
import { compress } from "lzutf8";
import { QRCode } from "qrcode-generator-ts";
import { OfflineCode } from "./offline-code";

interface Props {
  form: EntryFormType | undefined;
  submitResponse: (answer: Answer[], comments: string) => void;
}

interface State {
  answers: Answer[];
  qrcodeData: string;
}

export default class EntryForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.setAnswer = this.setAnswer.bind(this);
    this.updateState = this.updateState.bind(this);
    this.submit = this.submit.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  updateForm() {
    let answers: Answer[] = [];

    this.props.form?.categories.forEach((c) =>
      c.questions.forEach((q) => {
        switch (q.questionType) {
          // Initializing state
          case "SCORE":
            answers.push({
              questionId: q.id,
              slot1: "0",
              slot2: "0",
              slot3: "0",
              slot4: [],
              // gamepieces: [],
              // chargeFieldNodes: [],
            });
            break;
          case "COUNTER":
            answers.push({
              questionId: q.id,
              slot1: "0",
              slot2: "0",
              slot3: "0",
              slot4: [],
            });
            break;
          case "INPUT":
            answers.push({
              questionId: q.id,
              slot1: "",
              slot2: "",
              slot3: "",
              slot4: [],
            });
            break;
          case "BOOL":
            answers.push({
              questionId: q.id,
              slot1: "No",
              slot2: "0",
              slot3: "0",
              slot4: [],
            });
            break;
          case "SELECT":
            answers.push({
              questionId: q.id,
              slot1: q.options[0],
              slot2: "0",
              slot3: "0",
              slot4: [],
            });
            break;
          case "GAMEPIECE_INFO":
            answers.push({
              questionId: q.id,
              slot1: "0",
              slot2: "0",
              slot3: "0",
              slot4: [],
              gamepiece: [],
            });
            break;
          case "FIELD":
            answers.push({
              questionId: q.id,
              slot1: "0",
              slot2: "0",
              slot3: "0",
              slot4: [],
              chargeField: [],
            });
            break;
          case "DEFENSE":
            answers.push({
              questionId: q.id,
              slot1: "0",
              slot2: "0",
              slot3: "0",
              slot4: [],
            });
            break;
        }
      })
    );

    this.setState({ answers: answers });
  }

  componentDidMount() {
    this.updateForm();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps !== this.props) {
      console.log("updated!")
      this.updateForm();
    }
  }

  setAnswer(answers: Answer[], newAnswer: Answer): Answer[] {
    const currentAnswer = answers.filter(
      (e) => e.questionId === newAnswer.questionId
    )?.[0];

    currentAnswer.slot1 = newAnswer.slot1;
    currentAnswer.slot2 = newAnswer.slot2;
    currentAnswer.slot3 = newAnswer.slot3;
    currentAnswer.slot4 = newAnswer.slot4;
    currentAnswer.gamepiece = newAnswer.gamepiece;
    currentAnswer.chargeField = newAnswer.chargeField;

    return answers;
  }

  updateState(answer: Answer) {
    const answers: Answer[] = this.setAnswer(this.state.answers, answer);
    console.log(answers);
    this.setState({ answers: answers });
  }

  submit(comments: string) {
    this.props.submitResponse(this.state.answers, comments);
  }

  render(): React.ReactNode {
    return (
      <div className="w-full min-h-screen overflow-hidden dark:text-white">
        {this.props.form?.categories.map((category, i) => (
          <div key={i}>
            <div className="flex flex-col mb-4 border-b-8 dark:border-zinc-700">
              <h1 className="py-2 mb-2 mr-4 text-3xl font-semibold">
                {category?.name}
              </h1>
            </div>
            <div>
              {category.questions.map((question, j) => (
                <div key={j} className="my-8">
                  {renderFormQuestion(
                    question.questionType,
                    question.prompt as string,
                    question.id,
                    this.updateState,
                    question.options
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <form
          className="flex flex-col"
          onSubmit={(e: React.SyntheticEvent) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              comments: { value: string };
            };

            this.submit(target.comments.value);
          }}
        >
          <textarea
            id="comments"
            className="p-4 mb-4 border rounded-xl dark:bg-zinc-900 dark:border-zinc-700 border-slate-300 focus:outline-none"
            autoComplete="off"
            rows={10}
            placeholder="Team 1155 popped off this round!"
          />
          <button
            type="submit"
            className="p-2 mt-4 text-lg font-semibold text-white duration-150 bg-teal-500 rounded shadow focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
          
          {this.state ? <OfflineCode answers={this.state.answers} /> : null}
        </form>
      </div>
    );
  }
}
