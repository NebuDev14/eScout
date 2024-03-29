import { CreateScoutFormModal } from "../../modals/create-scout-form";
import { BsPencilFill, BsFillTrashFill } from "react-icons/bs";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "@util/trpc/trpc";

export const ManageScoutForm: React.FC<{
  teamId: string;
  isAdmin: boolean;
}> = ({ teamId, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const util = trpc.useContext();

  const { data: allMatchScouts } = trpc.match.getByTeam.useQuery({
    teamId: teamId,
  });
  const { data: allPitScouts } = trpc.pit.getByTeamId.useQuery({
    entityId: teamId,
  });

  const deleteForm = trpc.match.deleteForm.useMutation({
    onSuccess() {
      util.match.getByTeam.invalidate();
    },
  });

  return (
    <div className="min-h-screen">
      <div>
        {isAdmin ? (
          <button
            className="px-6 py-2 mt-3 mb-6 text-sm text-white duration-200 rounded-md bg-cyan-500 hover:bg-cyan-600"
            onClick={() => setIsOpen(true)}
          >
            Create
          </button>
        ) : null}
        <h1 className="my-3 text-2xl">
          <b>Match Scouts</b>
        </h1>
        <div className="grid w-full grid-cols-3 gap-6 md:grid-cols-1 md:gap-2">
          {allMatchScouts?.map((matchScout, i) => (
            <div
              className="py-2 mb-6 border shadow-lg rounded-xl bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700"
              key={i}
            >
              <div className="px-5 py-4">
                <div className="flex items-center justify-start mb-2">
                  <h1 className="mr-auto text-xl">
                    <b>{matchScout.name}</b>
                  </h1>
                  {isAdmin ? (
                    <Link
                      href={`/teams/${teamId}/matchscout/edit/${matchScout.id}`}
                      passHref
                    >
                      <BsPencilFill
                        size={25}
                        className="duration-150 hover:cursor-pointer hover:text-pink-600"
                      />
                    </Link>
                  ) : null}
                </div>
                <div className="flex items-center justify-center">
                  <h1 className="mr-auto text-lg">
                    {matchScout?.categories.reduce(
                      (x, y) => x + y.questions.length,
                      0
                    )}{" "}
                    Questions
                  </h1>
                  {isAdmin ? (
                    <BsFillTrashFill
                      size={20}
                      onClick={async () => {
                        deleteForm.mutateAsync({ entityId: matchScout.id });
                      }}
                      className="ml-2 text-red-500 duration-150 hover:cursor-pointer hover:text-red-600"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="my-3 text-2xl">
          <b>Pit Scouts</b>
        </h1>
        <div className="grid w-full grid-cols-3 gap-6 md:grid-cols-1 md:gap-2">
          {allPitScouts?.map((pitScout, i) => (
            <Link
              key={i}
              href={`/teams/${teamId}/pitscout/${pitScout.id}`}
              passHref
            >
              <div className="py-2 mb-6 border shadow-lg hover:cursor-pointer rounded-xl bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
                <div className="px-5 py-4">
                  <div className="flex items-center justify-start mb-2">
                    <h1 className="mr-auto text-xl">
                      <b>{pitScout.name}</b>
                    </h1>
                    {isAdmin ? (
                      <Link
                        href={`/teams/${teamId}/pitscout/edit/${pitScout.id}`}
                        passHref
                      >
                        <BsPencilFill
                          size={25}
                          className="duration-150 hover:cursor-pointer hover:text-pink-600"
                        />
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-center">
                    <h1 className="mr-auto text-lg">
                      {pitScout?.questions?.length} Questions
                    </h1>
                    <BsFillTrashFill
                      size={20}
                      className="ml-2 text-red-500 duration-150 hover:cursor-pointer hover:text-red-600"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <CreateScoutFormModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};
