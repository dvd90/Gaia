import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import Challenges from "./Challenges";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

const challenges = [
  { _id: "c1", title: "Recycle more", category: "Waste", gaia_points: 10, joined_by: [] },
  { _id: "c2", title: "LED bulbs", category: "Energy", gaia_points: 5, joined_by: [] },
  { _id: "c3", title: "Bike to work", category: "Transport", gaia_points: 20, joined_by: [] }
];

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation(url =>
    url === "/api/challenges"
      ? Promise.resolve({ data: challenges })
      : Promise.resolve({ data: {} })
  );
});

describe("Challenges", () => {
  it("shows Waste challenges by default", async () => {
    renderWithProviders(<Challenges />);
    expect(await screen.findByText("Recycle more")).toBeInTheDocument();
    expect(screen.queryByText("LED bulbs")).not.toBeInTheDocument();
  });

  it("filters by category tab", async () => {
    renderWithProviders(<Challenges />);
    await screen.findByText("Recycle more");

    await userEvent.click(screen.getByRole("tab", { name: "Energy" }));
    expect(screen.getByText("LED bulbs")).toBeInTheDocument();
    expect(screen.queryByText("Recycle more")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Transport" }));
    expect(screen.getByText("Bike to work")).toBeInTheDocument();
  });

  it("shows an empty state when a category has no challenges", async () => {
    api.get.mockResolvedValue({ data: [] });
    renderWithProviders(<Challenges />);
    expect(
      await screen.findByText(/No waste challenges yet/)
    ).toBeInTheDocument();
  });

  it("links to challenge creation", async () => {
    renderWithProviders(<Challenges />);
    await screen.findByText("Recycle more");
    expect(screen.getByText("+ New challenge")).toHaveAttribute(
      "href",
      "/create_challenge"
    );
  });
});
