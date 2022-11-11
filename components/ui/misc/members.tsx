import { trpc, useMutation, useQuery } from "../../../hooks/trpc";
import Image from "next/image";
import {
  BsFillPersonFill,
  BsClipboard,
  BsClipboardCheck,
} from "react-icons/bs";
import { RiVipCrownFill, RiMoreLine } from "react-icons/ri";
import { MemberStatus } from "@prisma/client";
import { useState } from "react";
import { Menu } from "@headlessui/react";

export const Members: React.FC<{ teamNum: number; isAdmin: boolean }> = ({
  teamNum,
  isAdmin,
}) => {
  const [copy, setCopy] = useState(false);
  const { data: members } = useQuery([
    "team.get-by-number",
    { number: teamNum },
  ]);

  const { invalidateQueries } = trpc.useContext();

  const promoteMember = useMutation("team.promote-member", {
    onSuccess() {
      invalidateQueries("team.get-by-number");
    },
  });

  const deleteMember = useMutation("team.remove-member", {
    onSuccess() {
      invalidateQueries("team.get-by-number");
    },
  });

  return (
    <div className="min-h-screen">
      <h1 className="my-4 text-2xl">
        <b>Members</b>
      </h1>
      <div className="flex items-center justify-start">
        <h1 className="px-6 py-2 text-2xl font-semibold rounded-l-lg bg-slate-300 dark:bg-zinc-900">
          {members?.inviteId}
        </h1>
        <button
          className="px-3 py-2 text-xl text-white bg-pink-600 rounded-r-lg shadow-md"
          onClick={() => {
            navigator.clipboard.writeText(members?.inviteId as string);
            setCopy(true);
          }}
        >
          {copy ? <BsClipboardCheck size={30} /> : <BsClipboard size={30} />}
        </button>
      </div>
      <div className="py-4 px-96 md:px-4">
        {members?.members.map((member, i) => (
          <div
            key={i}
            className="flex items-center justify-start px-8 py-4 border-b-2 dark:border-zinc-700"
          >
            <Image
              src={member.user.image as string}
              alt={member.user.name as string}
              height={45}
              width={45}
              className="rounded-full"
            />
            <h1 className="ml-4 mr-auto text-2xl">{member.user.name}</h1>
            {member.status === MemberStatus.CREATOR ? (
              <RiVipCrownFill size={30} />
            ) : (
              <BsFillPersonFill size={30} />
            )}
            {isAdmin ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white duration-200 rounded-md outline-none hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <RiMoreLine
                      size={30}
                      className="ml-2 text-black dark:text-white"
                    />
                  </Menu.Button>
                </div>

                <Menu.Items className="absolute right-0 z-50 w-56 mt-2 origin-top-right divide-y divide-gray-400 rounded-md shadow-lg dark:divide-zinc-700 dark:bg-zinc-900 bg-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className="flex items-center w-full px-2 py-2 text-sm text-pink-600 duration-200 rounded-md white group hover:text-white hover:bg-pink-600"
                          onClick={async () => {
                            await promoteMember.mutateAsync({
                              team: teamNum,
                              userId: member?.userId,
                            });
                          }}
                        >
                          Make Admin
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className="flex items-center w-full px-2 py-2 text-sm text-red-500 duration-200 rounded-md group hover:text-white hover:bg-red-500"
                          onClick={async () => {
                            await deleteMember.mutateAsync({
                              team: teamNum,
                              userId: member?.userId,
                            });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
