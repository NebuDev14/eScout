import ModalWrapper from "@components/ui/modal-wrapper";
import React, { useState } from "react";
import { BsCone, BsTrash2Fill, BsTrashFill } from "react-icons/bs";
import { GiCube } from "react-icons/gi";
import { MatchFormInput, Modal } from "types/misc-types";
import { motion } from "framer-motion";
import { GamepieceHeight, Location } from "@prisma/client";
import { GamepieceFormType } from "types/form-types";

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};

const levels = [
  {
    level: "LOW",
    color: "bg-purple-600",
  },
  {
    level: "MID",
    color: "bg-yellow-500",
  },
  {
    level: "HIGH",
    color: "bg-green-500",
  },
  {
    level: "DROPPED",
    color: "bg-red-500",
  },
];

export const GamepieceInput: React.FC<MatchFormInput> = ({
  label,
  id,
  updateState,
}) => {
  // Scoring states
  const [inputScore, setInputScore] = useState<GamepieceFormType | undefined>({
    location: "FIELD",
    height: "DROPPED",
    type: "CONE",
  });
  const [globalScore, setGlobalScore] = useState<GamepieceFormType[]>([]);

  // UI States
  const [isScoringOpen, setIsScoringOpen] = useState<boolean>(false);
  const [isCone, setIsCone] = useState<boolean>(true);

  const updateFormState = (nextState: GamepieceFormType[]) => {
    if (updateState) {
      updateState({
        questionId: id,
        gamepiece: nextState,
      });
    }
  };

  return (
    <>
      <h1 className="px-1 overflow-hidden text-lg font-semibold dark:text-zinc-300">
        {label}
      </h1>
      <div className="py-8 mt-4 overflow-x-hidden border-t-2 select-none border-zinc-600">
        <div className="flex justify-start px-12">
          <BsCone
            onClick={() => setIsCone(true)}
            size={80}
            className={`py-2 mr-auto text-yellow-500 hover:cursor-pointer ${
              isCone ? "border-b-4 border-green-400" : ""
            }`}
          />
          <GiCube
            onClick={() => setIsCone(false)}
            size={80}
            className={`py-2 text-purple-500 hover:cursor-pointer ${
              !isCone ? "border-b-4 border-green-400" : ""
            }`}
          />
        </div>
        <div className="grid grid-cols-2 mt-10 text-xl font-semibold text-white hover:cursor-pointer">
          <div
            onClick={() => {
              let current = inputScore;
              current!.location = "HPS";
              setInputScore(current);
              setIsScoringOpen(!isScoringOpen);
            }}
            className="py-6 text-center bg-pink-600 border-r-4 border-black rounded-l-xl "
          >
            Human Player
          </div>
          <div
            onClick={() => {
              let current = inputScore;
              current!.location = "FIELD";
              setInputScore(current);
              setIsScoringOpen(!isScoringOpen);
            }}
            className="py-6 text-center border-l-4 border-black rounded-r-xl bg-cyan-500"
          >
            Field
          </div>
        </div>
        <motion.nav
          animate={isScoringOpen ? "closed" : "open"}
          variants={variants}
        >
          <div
            className={`px-6 md:px-2 py-6 mt-4 duration-200 text-center absolute flex items-center justify-center flex-col `}
          >
            {globalScore.map((score, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="grid grid-flow-row grid-cols-4 gap-16 my-2">
                  <div
                    className="mr-12 "
                    onClick={() => {
                      const current = globalScore;
                      current[i].type = score.type === "CONE" ? "CUBE" : "CONE";
                      setGlobalScore([...current]);
                    }}
                  >
                    {score.type === "CONE" ? (
                      <BsCone
                        size={40}
                        className="text-yellow-500 hover:cursor-pointer"
                      />
                    ) : (
                      <GiCube
                        size={40}
                        className="text-purple-600 hover:cursor-pointer"
                      />
                    )}
                  </div>
                  <h1 className="text-lg text-center">{score.location}</h1>
                  <h1 className="text-lg text-center">{score.height}</h1>
                  <div className="flex items-center justify-center text-center hover:cursor-pointer">
                    <BsTrashFill
                      onClick={() => {
                        const curr = globalScore.filter((score, j) => j !== i);
                        setGlobalScore([...curr]);
                      }}
                      size={30}
                      className="text-center text-red-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.nav>
        <motion.nav
          animate={isScoringOpen ? "open" : "closed"}
          variants={variants}
        >
          <div className={`px-8 py-6 mt-4 duration-200`}>
            {levels.map((l, i) => (
              <div
                className={`${l.color} hover:cursor-pointer text-center my-2 py-4 text-white rounded-2xl `}
                key={i}
                onClick={() => {
                  let current = inputScore;
                  current!.height = l.level as GamepieceHeight;
                  setInputScore(current);
                  setIsScoringOpen(!isScoringOpen);

                  let nextState: GamepieceFormType[] = [
                    ...globalScore,
                    {
                      location: inputScore?.location as Location,
                      type: isCone ? "CONE" : "CUBE",
                      height: inputScore?.height as GamepieceHeight,
                    },
                  ];

                  setGlobalScore(nextState);
                  updateFormState(nextState);
                }}
              >
                <h1 className="text-xl font-bold">{l.level}</h1>
              </div>
            ))}
          </div>
        </motion.nav>
      </div>
    </>
  );
};
