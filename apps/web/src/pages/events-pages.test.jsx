import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import Events from "./Events";
import MyEvents from "./MyEvents";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
vi.mock("mapbox-gl", () => {
  class Map {
    addControl() {}
    remove() {}
  }
  class Marker {
    setLngLat() {
      return this;
    }
    setPopup() {
      return this;
    }
    addTo() {
      return this;
    }
    remove() {}
  }
  class Popup {
    setDOMContent() {
      return this;
    }
  }
  class NavigationControl {}
  return { default: { Map, Marker, Popup, NavigationControl } };
});
import api from "../api";

const future = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();
const past = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();

const events = [
  {
    _id: "e1",
    title: "Beach cleanup",
    location: "Tel Aviv",
    starts_at: future,
    ends_at: future,
    creator: { _id: TEST_USER._id, name: "Dana" },
    attendees: [],
    coords: { type: "Point", coordinates: [34.78, 32.08] }
  },
  {
    _id: "e2",
    title: "Tree planting",
    location: "Haifa",
    starts_at: future,
    ends_at: future,
    creator: { _id: "someone-else", name: "Noa" },
    attendees: [{ user: TEST_USER._id }],
    coords: { type: "Point", coordinates: [34.99, 32.79] }
  },
  {
    _id: "e3",
    title: "Old meetup",
    location: "Eilat",
    starts_at: past,
    ends_at: past,
    creator: { _id: "someone-else", name: "Noa" },
    attendees: [{ user: TEST_USER._id }],
    coords: { type: "Point", coordinates: [34.94, 29.55] }
  }
];

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation(url =>
    url === "/api/auth"
      ? Promise.resolve({ data: TEST_USER })
      : Promise.resolve({ data: events })
  );
});

describe("Events", () => {
  it("lists all events", async () => {
    renderWithProviders(<Events />);
    expect(await screen.findByText("Beach cleanup")).toBeInTheDocument();
    expect(screen.getByText("Tree planting")).toBeInTheDocument();
    expect(screen.getByText("+ New event")).toHaveAttribute(
      "href",
      "/create_event"
    );
  });

  it("switches to the map view", async () => {
    renderWithProviders(<Events />);
    await screen.findByText("Beach cleanup");
    await userEvent.click(screen.getByRole("tab", { name: "Map" }));
    // without a mapbox token the (lazily loaded) map explains what is missing
    expect(await screen.findByText(/VITE_MAPBOX_TOKEN/)).toBeInTheDocument();
  });

  it("shows an empty state without events", async () => {
    api.get.mockResolvedValue({ data: [] });
    renderWithProviders(<Events />);
    expect(await screen.findByText(/No events yet/)).toBeInTheDocument();
  });
});

describe("MyEvents", () => {
  const renderMine = () => {
    localStorage.setItem("token", "t");
    return renderWithProviders(<MyEvents />, {
      route: "/my_events",
      path: "/my_events"
    });
  };

  it("shows events I created by default", async () => {
    renderMine();
    expect(await screen.findByText("Beach cleanup")).toBeInTheDocument();
    expect(screen.queryByText("Tree planting")).not.toBeInTheDocument();
  });

  it("splits joined events into future and past", async () => {
    renderMine();
    await screen.findByText("Beach cleanup");

    await userEvent.click(screen.getByRole("tab", { name: "Future" }));
    expect(screen.getByText("Tree planting")).toBeInTheDocument();
    expect(screen.queryByText("Old meetup")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Past" }));
    expect(screen.getByText("Old meetup")).toBeInTheDocument();
    expect(screen.queryByText("Tree planting")).not.toBeInTheDocument();
  });

  it("shows empty messages per tab", async () => {
    api.get.mockImplementation(url =>
      url === "/api/auth"
        ? Promise.resolve({ data: TEST_USER })
        : Promise.resolve({ data: [] })
    );
    renderMine();
    expect(
      await screen.findByText(/didn't create any event/)
    ).toBeInTheDocument();
  });
});
