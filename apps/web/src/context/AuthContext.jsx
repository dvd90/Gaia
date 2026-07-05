import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await api.get("/api/auth");
      setUser(res.data);
      return res.data;
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/api/auth", { email, password });
      localStorage.setItem("token", res.data.token);
      return refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async data => {
      const res = await api.post("/api/users", data);
      localStorage.setItem("token", res.data.token);
      return refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("score");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
