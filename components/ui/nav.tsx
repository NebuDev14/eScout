import { useSession, signOut } from "next-auth/react";
import { BiLogOut, BiMenu } from "react-icons/bi";
import { IoMdBuild } from "react-icons/io";
import { BsSunFill } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { MdNightlight } from "react-icons/md";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAtom } from "jotai";
import { darkModeAtom } from "@server/atoms";

export const Nav: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  return (
    <>
      {session && (
        <div className="flex items-center justify-start px-4 py-2 border-b-2 border-gray-200 dark:border-gray-800 dark:text-white">
          <div className="flex items-center mr-auto">
          <Image src={session?.user?.image as string} width={40} height={40} className="rounded-full" alt={`${session?.user?.name} image`} />
          <h2 className="ml-4 text-lg md:w-full">{session?.user?.name}</h2>
          </div>
          <button className="mx-6" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <MdNightlight size={25} /> : <BsSunFill size={25} />}
          </button>
          <div className="text-right ">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white duration-200 bg-black rounded-md hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <BiMenu/ >
                </Menu.Button>
              </div>

              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg dark:divide-zinc-700 dark:bg-zinc-900 bg-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="flex items-center w-full px-2 py-2 text-sm text-black duration-200 rounded-md dark:text-white group hover:text-white hover:bg-black"
                        onClick={() => router.push("/teams")}
                      >
                        <IoMdBuild className="mr-2" /> Manage teams
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="flex items-center w-full px-2 py-2 text-sm text-yellow-500 duration-200 rounded-md group hover:text-white hover:bg-yellow-400"
                        onClick={() => router.push("/scout")}
                      >
                        <CgNotes className="mr-2" /> Match Scout
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="flex items-center w-full px-2 py-2 text-sm text-pink-600 duration-200 rounded-md group hover:text-white hover:bg-pink-600"
                        onClick={() => router.push("/scout/pit")}
                      >
                        <CgNotes className="mr-2" /> Pit Scout
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                      onClick={() => signOut()}
                        className="flex items-center w-full px-2 py-2 text-sm text-red-500 duration-200 rounded-md group hover:text-white hover:bg-red-400"
                      >
                        <BiLogOut className="mr-2 duration-200" /> Log out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      )}
    </>
  );
};
