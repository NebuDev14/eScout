import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import { CreateMatchCategoryModal } from "@components/modals/create-match-category";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "@components/modals/confirmation-modal";
import EditMatchModal from "@components/modals/edit-match-modal";
import {
  MatchFormCategory,
  ProfileType,
  Statistic,
  StatProfile,
} from "@prisma/client";
import { renderDesiredQuestionDisplay } from "@util/render-question-model";
import { trpc } from "@util/trpc/trpc";
import { Tab } from "@headlessui/react";
import { CreateStatProfileModal } from "@components/modals/create-stat-profile-modal";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "@server/routers/_app";
import { createContextInner } from "@server/context";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getSession } from "next-auth/react";

export default function EditMatchScout(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  
  const { matchId } = props;
  // console.log(props)

  const { data, isLoading } = trpc.match.getById.useQuery({
    id: matchId as string,
  });

  const utils = trpc.useContext();
  const [currentCategory, setCurrentCategory] =
    useState<MatchFormCategory | null>(null); // Category selected for action

  // Modals
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // Creating category modal
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false); // Editing categories
  const [isCategoryDeleteOpen, setIsCategoryDeleteOpen] = useState(false); // Delete confirmation modal
  const [isStatProfileOpen, setIsStatProfileOpen] = useState(false);
  const [isEditStatOpen, setIsEditStatOpen] = useState(false);

  // Page State
  const [selectedStat, setSelectedStat] = useState<
    StatProfile & {
      stats: Statistic[];
    }
  >();

  useEffect(() => {
    if (data?.profiles.length !== 0) {
      setSelectedStat(data?.profiles[0]);
    }
  }, [setSelectedStat]);

  const deleteCategoryMutation = trpc.match.deleteCategory.useMutation({
    onSuccess() {
      utils.match.getById.invalidate();
    },
  });

  const tabs = ["Form", "Stats"];

  return (
    <div className="min-h-screen py-1 2xl:px-52 xl:px-48 dark:text-white md:px-4">
      <BiArrowBack
        size={30}
        className="mb-4 duration-150 hover:text-pink-600 hover:cursor-pointer"
        onClick={() => router.back()}
      />
      <div className="flex items-center justify-start mb-4">
        <h1 className="mr-auto text-3xl ">
          Editing <b>{data?.name}</b>
        </h1>
      </div>
      <Tab.Group>
        <div className="flex flex-col items-start text-xl md:text-lg md:items-center">
          <Tab.List className="grid grid-cols-3 mt-4 mb-8">
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                className={({ selected }) =>
                  selected
                    ? "px-6 py-2 md:px-2 md:text-sm outline-none border-b-2 border-cyan-400"
                    : "px-6 py-2 md:px-2 md:text-sm"
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <button
              className="px-4 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700"
              onClick={() => setIsCategoryOpen(true)}
            >
              Add
            </button>
            <div className="mx-12 mt-8 2xl:px-24 xl:px-12">
              {data?.categories.map((category, i) => (
                <div key={i} className="my-4">
                  <div className="flex flex-row items-center mb-4 border-b-2 dark:border-zinc-700">
                    <h1 className="py-2 mr-4 text-3xl font-semibold">
                      {category?.name}
                    </h1>
                    <BsPencilFill
                      size={20}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setCurrentCategory(category);
                        setIsCategoryEditOpen(true);
                      }}
                    />
                    <BsFillTrashFill
                      size={20}
                      className="ml-4 text-red-400 duration-200 hover:text-red-500 hover:cursor-pointer"
                      onClick={() => {
                        setCurrentCategory(category);
                        setIsCategoryDeleteOpen(true);
                      }}
                    />
                  </div>
                  <div>
                    {category.questions.map((question, j) => (
                      <div key={j} className="my-8">
                        {renderDesiredQuestionDisplay(
                          question.questionType,
                          question.prompt as string,
                          question.options
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <CreateMatchCategoryModal
              isOpen={isCategoryOpen}
              setIsOpen={setIsCategoryOpen}
            />
            <EditMatchModal
              isOpen={isCategoryEditOpen}
              setIsOpen={setIsCategoryEditOpen}
              category={currentCategory!}
            />

            <ConfirmationModal
              action="Are you sure you want to delete this category?"
              description="All other questions under this category will also be wiped!"
              isOpen={isCategoryDeleteOpen}
              setIsOpen={setIsCategoryDeleteOpen}
              func={() => {
                deleteCategoryMutation.mutateAsync({
                  entityId: currentCategory!.id,
                });
                setIsCategoryDeleteOpen(false);
              }}
            />
          </Tab.Panel>
          <Tab.Panel>
            <button
              className="px-4 py-2 text-white duration-150 rounded-lg bg-cyan-400 hover:bg-cyan-500"
              onClick={() => setIsStatProfileOpen(true)}
            >
              Create
            </button>
            <div className="my-6">
              <select
                className="h-full p-2 mb-4 border-r-4 rounded-lg shadow-md outline-none dark:text-white dark:bg-zinc-900 dark:border-zinc-700"
                onChange={(e: React.SyntheticEvent) => {
                  const profile = data?.profiles.filter(
                    (p) => p.id === (e.target as HTMLSelectElement).value
                  )[0];
                  setSelectedStat(profile);
                }}
              >
                {data?.profiles.map((profile, i) => (
                  <option key={i} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>

              {selectedStat?.type === ProfileType.TEAM ? (
                <div className="px-4 py-4 dark:bg-zinc-900 rounded-xl">
                  <h1 className="text-3xl font-bold">{selectedStat?.name}</h1>
                </div>
              ) : (
                <div className="px-4 py-4 dark:bg-zinc-900 rounded-xl">
                  <h1 className="mb-4 text-3xl font-bold">
                    {selectedStat?.name}
                  </h1>
                  <div>
                    {selectedStat?.stats.map((stat, j) => (
                      <div key={j}>
                        <h1>{stat.name}</h1>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* {data??.profiles.filter((f) => f.id === selectedStat)} */}
              {/* {data??.profiles.map((profile, i) => (
                <div
                  className="px-4 py-2 mx-4 dark:bg-zinc-900 rounded-xl"
                  key={i}
                >
                  <div className="flex items-center">
                    <h1 className="mr-auto text-xl">{profile.name}</h1>
                    <BsPencilFill size={18} />
                  </div>
                </div>
              ))} */}
            </div>
            <CreateStatProfileModal
              isOpen={isStatProfileOpen}
              setIsOpen={setIsStatProfileOpen}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ match_id: string }>) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({
      session: await getSession(context),
    }),
  });

  const matchId = context.params?.match_id;

  await ssg.match.getById.prefetch({ id: matchId as string });
  
  return {
    props: {
      trpcState: ssg.dehydrate(),
      matchId
    }
  }

}
