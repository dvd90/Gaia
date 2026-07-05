import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, TEST_USER } from "../test-utils";
import Landing from "./Landing";
import Info from "./Info";
import QuizResult from "./QuizResult";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

beforeEach(() => vi.clearAllMocks());

describe("Landing", () => {
  it("invites anonymous visitors to join or login", async () => {
    renderWithProviders(<Landing />);
    await waitFor(() =>
      expect(screen.getByText("Be part of the change")).toBeInTheDocument()
    );
    expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
  });

  it("sends logged-in users to their dashboard", async () => {
    localStorage.setItem("token", "t");
    api.get.mockResolvedValue({ data: TEST_USER });
    renderWithProviders(<Landing />);
    await waitFor(() =>
      expect(screen.getByText("Go to my dashboard")).toBeInTheDocument()
    );
  });
});

describe("Info", () => {
  it("explains the three steps and links to the quiz", () => {
    renderWithProviders(<Info />);
    expect(screen.getByText(/1\. Choose a challenge/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Complete it/)).toBeInTheDocument();
    expect(screen.getByText("Start your journey")).toHaveAttribute(
      "href",
      "/quiz"
    );
  });
});

describe("QuizResult", () => {
  it("shows the stored score", () => {
    localStorage.setItem("score", "2.34");
    renderWithProviders(<QuizResult />);
    expect(screen.getByText("2.34")).toBeInTheDocument();
    expect(screen.getByText("Join the movement")).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("redirects to the quiz without a score", () => {
    renderWithProviders(<QuizResult />);
    expect(screen.queryByText("Join the movement")).not.toBeInTheDocument();
  });
});
