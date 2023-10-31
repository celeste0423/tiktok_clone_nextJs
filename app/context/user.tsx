"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { account, ID } from "@/libs/AppWriteClient";
import { useRouter } from "next/navigation";
import { User, UserContextTypes } from "../types";
import useCreateProfile from "../hooks/useCreateProfile";
import useGetProfileByUserId from "../hooks/useGetProfileByUserId";

const UserContext = createContext<UserContextTypes | null>(null);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const checkUser = async () => {
    try {
      const currentSession = await account.getSession("current");
      if (!currentSession) return;

      const promise = (await account.get()) as any;
      const profile = (await useGetProfileByUserId(promise?.$id)) as any;

      setUser({
        id: promise?.$id,
        name: promise?.name,
        bio: profile?.bio,
        image: profile?.image,
      });
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      //데이터베이스에 계정 생성
      const promise = await account.create(ID.unique(), email, password, name);
      await account.createEmailSession(email, password);

      await useCreateProfile(
        promise?.$id,
        name,
        String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEAFAULT_IMAGE_ID),
        ""
      );
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailSession(email, password);
      await checkUser();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  //제공할 유저 프로바이더(상태관리)는 리액트 FC를 만들어서 제공, 이 안에 있는 값들은 user사용 가능
  return (
    <UserContext.Provider value={{ user, register, login, logout, checkUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext);

// function useGetProfileByUserId($id: any) {
//   throw new Error("Function not implemented.");
// }
