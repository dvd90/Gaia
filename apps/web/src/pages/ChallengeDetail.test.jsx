import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import ChallengeDetail from "./ChallengeDetail";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

const challenge = overrides => ({
  _id: "c1",
  creator: "someone-else",
  title: "Zero waste week",
  category: "Waste",
  description: "No plastic",
  gaia_points: 10,
  joined_by: [],
  ...overrides
});

const renderDetail = doc => {
  localStorage.setItem("token", "t");
  api.get.mockImplementation(url =>
    url === "/api/auth"
      ? Promise.resolve({ data: TEST_USER })
      : Promise.resolve({ data: doc })
  );
  return renderWithProviders(<ChallengeDetail />, {
    route: "/challenges/c1",
    path: "/challenges/:id"
  });
};

beforeEach(() => vi.clearAllMocks());

describe("ChallengeDetail", () => {
  it("lets a new participant accept the challenge", async () => {
    api.put.mockResolvedValue({ data: {} });
    renderDetail(challenge());

    await userEvent.click(await screen.findByText("Accept challenge"));
    await userEvent.click(screen.getByText("Let's go"));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/api/challenges/c1/join")
    );
    // navigated to dashboard
    expect(screen.getByTestId("other-route")).toBeInTheDocument();
  });

  it("does not join when the dialog is cancelled", async () => {
    renderDetail(challenge());
    await userEvent.click(await screen.findByText("Accept challenge"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(api.put).not.toHaveBeenCalled();
  });

  it("lets an in-progress participant complete it", async () => {
    api.put.mockResolvedValue({ data: {} });
    renderDetail(
      challenge({ joined_by: [{ user: TEST_USER._id, status: "In Progress" }] })
    );

    await userEvent.click(await screen.findByText("I completed it"));
    await userEvent.click(screen.getByText("Yes, I did it!"));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/api/challenges/c1/completed")
    );
  });

  it("shows the completed badge", async () => {
    renderDetail(
      challenge({ joined_by: [{ user: TEST_USER._id, status: "Completed" }] })
    );
    expect(await screen.findByText(/Challenge completed/)).toBeInTheDocument();
  });

  it("shows edit/delete only to the creator and deletes", async () => {
    api.delete.mockResolvedValue({ data: {} });
    renderDetail(challenge({ creator: TEST_USER._id }));

    expect(await screen.findByText("✏️ Edit")).toHaveAttribute(
      "href",
      "/edit_challenge/c1"
    );
    await userEvent.click(screen.getByText("🗑 Delete"));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(api.delete).toHaveBeenCalledWith("/api/challenges/c1")
    );
  });

  it("hides owner actions from non-creators", async () => {
    renderDetail(challenge());
    await screen.findByText("Zero waste week");
    expect(screen.queryByText("🗑 Delete")).not.toBeInTheDocument();
  });

  it("shows a friendly message when the challenge is gone", async () => {
    localStorage.setItem("token", "t");
    api.get.mockImplementation(url =>
      url === "/api/auth"
        ? Promise.resolve({ data: TEST_USER })
        : Promise.reject(new Error("404"))
    );
    renderWithProviders(<ChallengeDetail />, {
      route: "/challenges/c1",
      path: "/challenges/:id"
    });
    expect(
      await screen.findByText(/does not exist anymore/)
    ).toBeInTheDocument();
  });

  it("surfaces API errors as toasts when joining fails", async () => {
    api.put.mockRejectedValue({
      response: { data: { msg: "You already joined this challenge" } }
    });
    renderDetail(challenge());
    await userEvent.click(await screen.findByText("Accept challenge"));
    await userEvent.click(screen.getByText("Let's go"));
    expect(
      await screen.findByText("You already joined this challenge")
    ).toBeInTheDocument();
  });
});
