import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

const USER = { _id: "u1", name: "Dana" };

const Probe = () => {
  const { user, loading, isAuthenticated, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="state">
        {loading ? "loading" : isAuthenticated ? `hi ${user.name}` : "anon"}
      </span>
      <button onClick={() => login("a@b.co", "secret123").catch(() => {})}>
        login
      </button>
      <button
        onClick={() => register({ name: "Dana" }).catch(() => {})}
      >
        register
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

beforeEach(() => vi.clearAllMocks());

describe("AuthProvider", () => {
  it("stays anonymous without a stored token", async () => {
    renderProbe();
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("anon")
    );
    expect(api.get).not.toHaveBeenCalled();
  });

  it("loads the user when a token is stored", async () => {
    localStorage.setItem("token", "t");
    api.get.mockResolvedValue({ data: USER });

    renderProbe();

    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("hi Dana")
    );
    expect(api.get).toHaveBeenCalledWith("/api/auth");
  });

  it("drops an invalid stored token", async () => {
    localStorage.setItem("token", "expired");
    api.get.mockRejectedValue(new Error("401"));

    renderProbe();

    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("anon")
    );
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("login stores the token and loads the user", async () => {
    api.post.mockResolvedValue({ data: { token: "fresh-token" } });
    api.get.mockResolvedValue({ data: USER });

    renderProbe();
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("anon")
    );

    await userEvent.click(screen.getByText("login"));

    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("hi Dana")
    );
    expect(localStorage.getItem("token")).toBe("fresh-token");
    expect(api.post).toHaveBeenCalledWith("/api/auth", {
      email: "a@b.co",
      password: "secret123"
    });
  });

  it("register stores the token and loads the user", async () => {
    api.post.mockResolvedValue({ data: { token: "reg-token" } });
    api.get.mockResolvedValue({ data: USER });

    renderProbe();
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("anon")
    );

    await userEvent.click(screen.getByText("register"));

    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("hi Dana")
    );
    expect(localStorage.getItem("token")).toBe("reg-token");
  });

  it("logout clears the session and quiz score", async () => {
    localStorage.setItem("token", "t");
    localStorage.setItem("score", "2.1");
    api.get.mockResolvedValue({ data: USER });

    renderProbe();
    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent("hi Dana")
    );

    await act(async () => {
      await userEvent.click(screen.getByText("logout"));
    });

    expect(screen.getByTestId("state")).toHaveTextContent("anon");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("score")).toBeNull();
  });
});
