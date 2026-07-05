import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import Dashboard from "./Dashboard";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

const challenges = [
  {
    _id: "c1",
    title: "Created by me",
    category: "Waste",
    gaia_points: 10,
    creator: { _id: TEST_USER._id, name: "Dana" },
    joined_by: []
  },
  {
    _id: "c2",
    title: "In progress one",
    category: "Energy",
    gaia_points: 5,
    creator: { _id: "someone-else", name: "Noa" },
    joined_by: [{ user: TEST_USER._id, status: "In Progress" }]
  },
  {
    _id: "c3",
    title: "Completed one",
    category: "Transport",
    gaia_points: 20,
    creator: { _id: "someone-else", name: "Noa" },
    joined_by: [{ user: TEST_USER._id, status: "Completed" }]
  }
];

const renderDashboard = () => {
  localStorage.setItem("token", "t");
  api.get.mockImplementation(url =>
    url === "/api/auth"
      ? Promise.resolve({ data: TEST_USER })
      : Promise.resolve({ data: challenges })
  );
  return renderWithProviders(<Dashboard />, {
    route: "/dashboard",
    path: "/dashboard"
  });
};

beforeEach(() => vi.clearAllMocks());

describe("Dashboard", () => {
  it("greets the user with their stats", async () => {
    renderDashboard();
    expect(await screen.findByText(/Hey Dana/)).toBeInTheDocument();
    expect(screen.getByText("Gaia points")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("2.10")).toBeInTheDocument();
  });

  it("counts in-progress and completed challenges", async () => {
    renderDashboard();
    await screen.findByText(/Hey Dana/);
    const stats = document.querySelectorAll(".stat-number");
    const values = [...stats].map(s => s.textContent);
    expect(values).toContain("1"); // in progress + completed each = 1
  });

  it("filters challenges by tab", async () => {
    renderDashboard();
    // "All" excludes what I created or completed
    expect(await screen.findByText("In progress one")).toBeInTheDocument();
    expect(screen.queryByText("Created by me")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Created" }));
    expect(screen.getByText("Created by me")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Completed" }));
    expect(screen.getByText("Completed one")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "In progress" }));
    expect(screen.getByText("In progress one")).toBeInTheDocument();
  });
});
