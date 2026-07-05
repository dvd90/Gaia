import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import Login from "./Login";
import Register from "./Register";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

beforeEach(() => vi.clearAllMocks());

describe("Login", () => {
  it("logs the user in", async () => {
    api.post.mockResolvedValue({ data: { token: "tok" } });
    api.get.mockResolvedValue({ data: TEST_USER });
    renderWithProviders(<Login />, { route: "/login", path: "/login" });

    await waitFor(() => screen.getByLabelText(/Email/));
    await userEvent.type(screen.getByLabelText(/Email/), "dana@example.com");
    await userEvent.type(screen.getByLabelText(/Password/), "secret123");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/auth", {
        email: "dana@example.com",
        password: "secret123"
      })
    );
    expect(localStorage.getItem("token")).toBe("tok");
  });

  it("shows the API error message on failure", async () => {
    api.post.mockRejectedValue({
      response: { data: { errors: [{ msg: "Invalid Credentials" }] } }
    });
    renderWithProviders(<Login />);

    await waitFor(() => screen.getByLabelText(/Email/));
    await userEvent.type(screen.getByLabelText(/Email/), "dana@example.com");
    await userEvent.type(screen.getByLabelText(/Password/), "wrong-pass");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid Credentials")).toBeInTheDocument();
  });

  it("redirects away when already authenticated", async () => {
    localStorage.setItem("token", "t");
    api.get.mockResolvedValue({ data: TEST_USER });
    renderWithProviders(<Login />, { route: "/login", path: "/login" });
    await waitFor(() =>
      expect(screen.getByTestId("other-route")).toBeInTheDocument()
    );
  });
});

describe("Register", () => {
  const fill = async (overrides = {}) => {
    const values = {
      Name: "Dana",
      Email: "dana@example.com",
      "^Password$": "secret123",
      "Confirm password": "secret123",
      Address: "Tel Aviv",
      ...overrides
    };
    for (const [label, value] of Object.entries(values)) {
      await userEvent.type(
        screen.getByLabelText(new RegExp(label)),
        value
      );
    }
  };

  it("registers with the stored quiz score", async () => {
    localStorage.setItem("score", "2.10");
    api.post.mockResolvedValue({ data: { token: "tok" } });
    api.get.mockResolvedValue({ data: TEST_USER });
    renderWithProviders(<Register />, { route: "/register", path: "/register" });

    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/users", {
        name: "Dana",
        email: "dana@example.com",
        password: "secret123",
        address: "Tel Aviv",
        planet_consuption: "2.10"
      })
    );
  });

  it("rejects mismatched passwords before calling the API", async () => {
    renderWithProviders(<Register />);
    await fill({ "Confirm password": "different-pass" });
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("shows the API error message on failure", async () => {
    api.post.mockRejectedValue({
      response: { data: { errors: [{ msg: "User already exist" }] } }
    });
    renderWithProviders(<Register />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("User already exist")).toBeInTheDocument();
  });
});
