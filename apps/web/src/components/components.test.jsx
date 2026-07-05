import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { renderWithProviders, TEST_USER } from "../test-utils";
import ChallengeCard from "./ChallengeCard";
import EventCard from "./EventCard";
import ImpactMeter from "./ImpactMeter";
import CategoryArt from "./CategoryArt";
import Tabs from "./Tabs";
import Spinner from "./Spinner";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

beforeEach(() => vi.clearAllMocks());

const loginAs = user => {
  localStorage.setItem("token", "t");
  api.get.mockResolvedValue({ data: user });
};

describe("ChallengeCard", () => {
  const challenge = {
    _id: "c1",
    title: "Zero waste week",
    category: "Waste",
    gaia_points: 15,
    joined_by: []
  };

  it("links to the challenge with its info", () => {
    renderWithProviders(<ChallengeCard challenge={challenge} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/challenges/c1");
    expect(screen.getByText("Zero waste week")).toBeInTheDocument();
    expect(screen.getByText("+15 pts")).toBeInTheDocument();
  });

  it("renders nothing without a challenge", () => {
    const { container } = renderWithProviders(<ChallengeCard />);
    expect(container.querySelector(".card")).toBeNull();
  });
});

describe("EventCard", () => {
  it("shows time and location", () => {
    const future = new Date(Date.now() + 3.1 * 24 * 3600 * 1000).toISOString();
    renderWithProviders(
      <EventCard
        event={{
          _id: "e1",
          title: "Beach cleanup",
          location: "Tel Aviv",
          starts_at: future,
          attendees: []
        }}
      />
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/events/e1");
    expect(screen.getByText(/Tel Aviv/)).toBeInTheDocument();
    expect(screen.getByText(/in 3 days/)).toBeInTheDocument();
  });

  it("renders nothing without an event", () => {
    const { container } = renderWithProviders(<EventCard />);
    expect(container.querySelector(".card")).toBeNull();
  });
});

describe("ImpactMeter", () => {
  it("fills leaves proportionally to points", () => {
    const { container } = render(<ImpactMeter points={15} />);
    expect(container.querySelectorAll(".leaf.on")).toHaveLength(3);
    expect(container.querySelectorAll(".leaf")).toHaveLength(5);
  });

  it("clamps to the 1–5 range", () => {
    const { container: low } = render(<ImpactMeter points={0} />);
    expect(low.querySelectorAll(".leaf.on")).toHaveLength(1);
    const { container: high } = render(<ImpactMeter points={100} />);
    expect(high.querySelectorAll(".leaf.on")).toHaveLength(5);
  });
});

describe("CategoryArt", () => {
  it("renders category-specific art", () => {
    const { container } = render(<CategoryArt category="Energy" />);
    expect(container.querySelector(".art-energy")).toBeInTheDocument();
  });

  it("falls back to event art for unknown categories", () => {
    const { container } = render(<CategoryArt category="Mystery" />);
    expect(container.querySelector(".art-event")).toBeInTheDocument();
  });
});

describe("Tabs", () => {
  it("marks the active tab and notifies on change", async () => {
    const onChange = vi.fn();
    render(
      <Tabs
        tabs={[
          { key: "a", label: "Alpha" },
          { key: "b", label: "Beta" }
        ]}
        active="a"
        onChange={onChange}
      />
    );
    expect(screen.getByText("Alpha")).toHaveClass("active");
    await userEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("Spinner", () => {
  it("renders a loading indicator", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

describe("Navbar", () => {
  it("shows Login and hides private links when logged out", async () => {
    renderWithProviders(<Navbar />);
    await waitFor(() =>
      expect(screen.getByText("Login")).toBeInTheDocument()
    );
    expect(screen.queryByText("My Events")).not.toBeInTheDocument();
    expect(screen.getByText("Challenges")).toBeInTheDocument();
  });

  it("shows private links and logout when logged in", async () => {
    loginAs(TEST_USER);
    renderWithProviders(<Navbar />);
    await waitFor(() =>
      expect(screen.getByText("My Events")).toBeInTheDocument()
    );
    expect(screen.getByText(/Log out/)).toBeInTheDocument();
  });

  it("logs out and navigates home", async () => {
    loginAs(TEST_USER);
    renderWithProviders(<Navbar />);
    await waitFor(() =>
      expect(screen.getByText(/Log out/)).toBeInTheDocument()
    );
    await userEvent.click(screen.getByText(/Log out/));
    expect(localStorage.getItem("token")).toBeNull();
    await waitFor(() =>
      expect(screen.getByText("Login")).toBeInTheDocument()
    );
  });

  it("toggles the mobile menu", async () => {
    renderWithProviders(<Navbar />);
    const burger = screen.getByLabelText("Toggle menu");
    await userEvent.click(burger);
    expect(document.querySelector(".nav-links")).toHaveClass("open");
    await userEvent.click(burger);
    expect(document.querySelector(".nav-links")).not.toHaveClass("open");
  });
});

describe("ProtectedRoute", () => {
  it("redirects anonymous visitors to /login", async () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>,
      { route: "/private", path: "/private" }
    );
    await waitFor(() =>
      expect(screen.queryByText("secret")).not.toBeInTheDocument()
    );
  });

  it("renders children for authenticated users", async () => {
    loginAs(TEST_USER);
    renderWithProviders(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    await waitFor(() => expect(screen.getByText("secret")).toBeInTheDocument());
  });
});
