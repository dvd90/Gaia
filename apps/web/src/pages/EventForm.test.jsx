import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import EventForm from "./EventForm";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("token", "t");
  api.get.mockImplementation(url =>
    url === "/api/auth"
      ? Promise.resolve({ data: TEST_USER })
      : Promise.resolve({ data: {} })
  );
});

const fill = async () => {
  await userEvent.type(await screen.findByLabelText(/Title/), "Beach cleanup");
  await userEvent.type(screen.getByLabelText(/Location/), "Tel Aviv beach");
  await userEvent.type(screen.getByLabelText(/Description/), "Bring gloves");
  await userEvent.type(screen.getByLabelText(/Starts at/), "2026-08-01T10:00");
  await userEvent.type(screen.getByLabelText(/Ends at/), "2026-08-01T13:00");
};

describe("EventForm (create)", () => {
  it("creates an event with ISO dates", async () => {
    api.post.mockResolvedValue({ data: { _id: "e9" } });
    renderWithProviders(<EventForm />, {
      route: "/create_event",
      path: "/create_event"
    });

    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe("/api/events");
    expect(body.title).toBe("Beach cleanup");
    expect(body.location).toBe("Tel Aviv beach");
    // dates are sent as ISO strings the API can validate
    expect(new Date(body.starts_at).toISOString()).toBe(body.starts_at);
    expect(screen.getByTestId("other-route")).toBeInTheDocument();
  });

  it("requires every field", async () => {
    renderWithProviders(<EventForm />, {
      route: "/create_event",
      path: "/create_event"
    });
    await userEvent.click(
      await screen.findByRole("button", { name: "Create event" })
    );
    expect(await screen.findByText("All fields are required")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("rejects an event that ends before it starts", async () => {
    renderWithProviders(<EventForm />, {
      route: "/create_event",
      path: "/create_event"
    });
    await userEvent.type(await screen.findByLabelText(/Title/), "Oops");
    await userEvent.type(screen.getByLabelText(/Location/), "Somewhere");
    await userEvent.type(screen.getByLabelText(/Description/), "Time travel");
    await userEvent.type(screen.getByLabelText(/Starts at/), "2026-08-02T10:00");
    await userEvent.type(screen.getByLabelText(/Ends at/), "2026-08-01T10:00");
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    expect(
      await screen.findByText("The event cannot end before it starts")
    ).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("surfaces geocoding errors from the API", async () => {
    api.post.mockRejectedValue({
      response: {
        data: { errors: [{ msg: "Could not locate this address" }] }
      }
    });
    renderWithProviders(<EventForm />, {
      route: "/create_event",
      path: "/create_event"
    });
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    expect(
      await screen.findByText("Could not locate this address")
    ).toBeInTheDocument();
  });
});

describe("EventForm (edit)", () => {
  it("prefills and saves changes", async () => {
    const existing = {
      _id: "e1",
      title: "Old event",
      location: "Old place",
      description: "Old description",
      starts_at: "2026-08-01T10:00:00.000Z",
      ends_at: "2026-08-01T13:00:00.000Z"
    };
    api.get.mockImplementation(url =>
      url === "/api/auth"
        ? Promise.resolve({ data: TEST_USER })
        : Promise.resolve({ data: existing })
    );
    api.put.mockResolvedValue({ data: { _id: "e1" } });

    renderWithProviders(<EventForm />, {
      route: "/edit_event/e1",
      path: "/edit_event/:id"
    });

    const title = await screen.findByLabelText(/Title/);
    await waitFor(() => expect(title).toHaveValue("Old event"));

    await userEvent.clear(title);
    await userEvent.type(title, "Renamed event");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(api.put).toHaveBeenCalled());
    const [url, body] = api.put.mock.calls[0];
    expect(url).toBe("/api/events/e1");
    expect(body.title).toBe("Renamed event");
    expect(body.location).toBe("Old place");
  });
});
