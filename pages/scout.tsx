import type { NextPage } from "next";
import React from "react";
import { Protected } from "../components/auth/protected";
import { Container } from "../components/ui/container";
import { MatchInfo } from "../components/ui/form/match-info";
import { ScoreBoard } from "../components/ui/form/score-board";
import { Input } from "../components/ui/input";
import { MatchType } from "@prisma/client";

const submitData = async (event: React.SyntheticEvent) => {
  event.preventDefault();
  const target = event.target as typeof event.target & {
    // Match Info
    matchType: { value: MatchType };
    matchNumber: { value: string };
    teamNumber: { value: string };
    eventName: { value: string };
    mobility: { value: string };
  };

  const data = {
    matchType: target.matchType.value,
    matchNumber: target.matchNumber.value,
    teamNumber: target.teamNumber.value,
    eventName: target.eventName.value,
    mobility: (target.mobility.value === "yes"),
    
    autoHighShotsMade: Number(document.getElementById("autoHighGoalShots")?.innerText),
    autoHighShotsTotal: Number(document.getElementById("autoHighGoalTotal")?.innerText),
    autoLowShotsMade: Number(document.getElementById("autoLowGoalShots")?.innerText),
    autoLowShotsTotal: Number(document.getElementById("autoLowGoalTotal")?.innerText),
    
    teleopHighShotsMade: Number(document.getElementById("teleopHighGoalShots")?.innerText),
    teleopHighShotsTotal: Number(document.getElementById("teleopHighGoalTotal")?.innerText),
    teleopLowShotsMade: Number(document.getElementById("teleopLowGoalShots")?.innerText),
    teleopLowShotsTotal: Number(document.getElementById("teleopLowGoalTotal")?.innerText),
    
  };

  console.log(data)
};

const Scout: NextPage = () => {
  return (
    <Protected>
      <div className="h-full px-56 py-4 lg:px-4">
        <form onSubmit={submitData} className="grid grid-cols-1">
          <h1 className="mt-4 mb-2 text-3xl font-semibold">Match Info</h1>
          <MatchInfo />
          <h1 className="mb-4 text-3xl font-semibold">Auto</h1>
          <Container>
            <label className="p-2 text-lg font-semibold leading-tight border rounded shadow bg-slate-200 focus:outline-none focus:shadow-outline">
              Mobility
            </label>
            <select
              id="mobility"
              className="p-2 text-lg leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
            >
              <option value="no" >No</option>
              <option value="yes" >Yes</option>
            </select>
          </Container>
          <ScoreBoard label="High Goal" id="autoHighGoal" />
          <ScoreBoard label="Low Goal" id="autoLowGoal" />
          <h1 className="mt-4 mb-2 text-3xl font-semibold">Teleop</h1>
          <ScoreBoard label="High Goal" id="teleopHighGoal" />
          <ScoreBoard label="Low Goal" id="teleopLowGoal" />
          <h1 className="my-4 text-3xl font-semibold ">Defense</h1>
          <div className="mb-2">
            <Container>
              <label className="flex items-center justify-start p-2 text-lg leading-tight border rounded shadow bg-slate-200 focus:outline-none focus:shadow-outline">
                Defended
              </label>
              <div className="flex">
                <input
                  className="w-10/12 h-full p-2 text-lg border rounded-l border-blue-lighter"
                  type="text"
                  placeholder="Team number"
                  autoComplete="off"
                />
                <button className="flex items-center justify-center px-4 text-white bg-blue-500 border-t border-b border-l rounded-r p bg-blue-lighter border-blue-lighter text-blue-dark">
                  +
                </button>
              </div>
            </Container>
          </div>
          <Container>
            <label className="flex items-center justify-start p-2 text-lg leading-tight border rounded shadow bg-slate-200 focus:outline-none focus:shadow-outline">
              Defended by
            </label>
            <div className="flex">
              <input
                className="w-10/12 h-full p-2 text-lg border rounded-l border-blue-lighter"
                type="text"
                placeholder="Team number"
                autoComplete="off"
              />
              <button className="flex items-center justify-center px-4 text-white bg-blue-500 border-t border-b border-l rounded-r p bg-blue-lighter border-blue-lighter text-blue-dark">
                +
              </button>
            </div>
          </Container>
          <h1 className="my-4 text-3xl font-semibold ">Endgame</h1>
          <div className="mb-2">
            <Container>
              <label className="p-2 text-lg leading-tight border rounded shadow bg-slate-200 focus:outline-none focus:shadow-outline">
                Climb start time
              </label>
              <Input
                id="climbStart"
                placeholder="Start time"
                type="number"
                autoComplete="off"
              />
            </Container>
          </div>
          <div className="mb-2">
            <Container>
              <label className="p-2 text-lg leading-tight border rounded shadow bg-slate-200 focus:outline-none focus:shadow-outline">
                Climb end time
              </label>
              <Input
                id="climbEnd"
                placeholder="End time"
                type="number"
                autoComplete="off"
              />
            </Container>
          </div>
          <Container>
            <label className="p-2 text-lg leading-tight border rounded shadow bg-slate-200 focus:outline-none focus:shadow-outline">
              Climb rung
            </label>
            <select
              id="climbBar"
              className="p-2 text-lg leading-tight border rounded shadow focus:outline-none focus:shadow-outline"
            >
              <option>None</option>
              <option>Low</option>
              <option>Mid</option>
              <option>High</option>
              <option>Traversal</option>
            </select>
          </Container>
          <h1 className="my-4 text-3xl font-semibold ">Comments</h1>
          <textarea
            id="comments"
            className="p-4 border rounded-xl border-slate-300"
            autoComplete="off"
            rows={10}
          />
          <button
            type="submit"
            className="p-2 mt-4 text-lg font-semibold text-white bg-teal-500 rounded shadow focus:outline-none focus:shadow-outline hover:bg-teal-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Protected>
  );
};

export default Scout;
