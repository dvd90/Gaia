import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import EventDetail from "./EventDetail";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

const future = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();

const event = overrides => ({
  _id: "e1",
  creator: "someone-else",
  title: "Beach cleanup",
  location: "Tel Aviv",
  description: "Bring gloves",
  starts_at: future,
  ends_at: future,
  attendees: [],
  ...overrides
});

const renderDetail = doc => {
  localStorage.setItem("token", "t");
  api.get.mockImplementation(url =>
    url === "/api/auth"
      ? Promise.resolve({ data: TEST_USER })
      : Promise.resolve({ data: doc })
  );
  return renderWithProviders(<EventDetail />, {
    route: "/events/e1",
    path: "/events/:id"
  });
};

beforeEach(() => vi.clearAllMocks());

describe("EventDetail", () => {
  it("joins the event after confirmation", async () => {
    api.put.mockResolvedValue({ data: {} });
    renderDetail(event());

    await userEvent.click(await screen.findByText("Join event"));
    await userEvent.click(screen.getByText("Count me in"));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/api/events/e1/join")
    );
    expect(screen.getByTestId("other-route")).toBeInTheDocument();
  });

  it("shows the attending badge when already joined", async () => {
    renderDetail(event({ attendees: [{ user: TEST_USER._id }] }));
    expect(await screen.findByText(/You're attending/)).toBeInTheDocument();
    expect(screen.queryByText("Join event")).not.toBeInTheDocument();
  });

  it("lets the creator delete the event", async () => {
    api.delete.mockResolvedValue({ data: {} });
    renderDetail(event({ creator: TEST_USER._id }));

    await userEvent.click(await screen.findByText("🗑 Delete"));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(api.delete).toHaveBeenCalledWith("/api/events/e1")
    );
  });

  it("hides owner actions from non-creators", async () => {
    renderDetail(event());
    await screen.findByText("Beach cleanup");
    expect(screen.queryByText("🗑 Delete")).not.toBeInTheDocument();
  });

  it("shows a friendly message when the event is gone", async () => {
    localStorage.setItem("token", "t");
    api.get.mockImplementation(url =>
      url === "/api/auth"
        ? Promise.resolve({ data: TEST_USER })
        : Promise.reject(new Error("404"))
    );
    renderWithProviders(<EventDetail />, {
      route: "/events/e1",
      path: "/events/:id"
    });
    expect(
      await screen.findByText(/does not exist anymore/)
    ).toBeInTheDocument();
  });
});
