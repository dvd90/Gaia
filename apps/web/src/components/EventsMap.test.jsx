import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));

const markerInstances = [];
const mapInstances = [];

vi.mock("mapbox-gl", () => {
  class Map {
    constructor(opts) {
      this.opts = opts;
      this.addControl = vi.fn();
      this.remove = vi.fn();
      mapInstances.push(this);
    }
  }
  class Marker {
    constructor(opts) {
      this.opts = opts;
      this.setLngLat = vi.fn().mockReturnValue(this);
      this.setPopup = vi.fn().mockReturnValue(this);
      this.addTo = vi.fn().mockReturnValue(this);
      this.remove = vi.fn();
      markerInstances.push(this);
    }
  }
  class Popup {
    setDOMContent() {
      return this;
    }
  }
  class NavigationControl {}
  return { default: { Map, Marker, Popup, NavigationControl } };
});

import EventsMap from "./EventsMap";

const events = [
  {
    _id: "e1",
    title: "Cleanup",
    location: "Beach",
    coords: { type: "Point", coordinates: [34.78, 32.08] }
  },
  { _id: "e2", title: "No coords", location: "Unknown", coords: null }
];

beforeEach(() => {
  markerInstances.length = 0;
  mapInstances.length = 0;
  vi.unstubAllEnvs();
});

describe("EventsMap", () => {
  it("asks for a token when none is configured", () => {
    renderWithProviders(<EventsMap events={events} />);
    expect(screen.getByText(/VITE_MAPBOX_TOKEN/)).toBeInTheDocument();
  });

  it("creates one marker per geocoded event", () => {
    vi.stubEnv("VITE_MAPBOX_TOKEN", "pk.test");
    renderWithProviders(<EventsMap events={events} />);

    expect(screen.getByTestId("events-map")).toBeInTheDocument();
    expect(mapInstances).toHaveLength(1);
    // the event without coords is skipped
    expect(markerInstances).toHaveLength(1);
    expect(markerInstances[0].setLngLat).toHaveBeenCalledWith([34.78, 32.08]);
  });

  it("cleans up the map on unmount", () => {
    vi.stubEnv("VITE_MAPBOX_TOKEN", "pk.test");
    const { unmount } = renderWithProviders(<EventsMap events={events} />);
    unmount();
    expect(mapInstances[0].remove).toHaveBeenCalled();
    expect(markerInstances[0].remove).toHaveBeenCalled();
  });
});
