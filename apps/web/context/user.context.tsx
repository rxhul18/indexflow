"use client";
import { authClient } from "@iflow/auth";
import { UserType } from "@iflow/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  user: UserType | null;
  userIP: string | null;
  loading: boolean;
  setUser: (user: UserType | null) => void;
  setUserIP: (userIP: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userIP, setUserIP] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          console.warn(session, "boobs")
          setUser(session.data.user);
        } else {
          setUser(null);
        }

        if (session.data?.session) {
          // console.log(userIP, "boobs")
          setUserIP(session.data.session.ipAddress!);
        } else {
          setUserIP(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, userIP, setUserIP }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
