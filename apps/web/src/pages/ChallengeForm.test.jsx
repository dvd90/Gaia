import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, TEST_USER } from "../test-utils";
import ChallengeForm from "./ChallengeForm";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

const authGet = data => url =>
  url === "/api/auth"
    ? Promise.resolve({ data: TEST_USER })
    : Promise.resolve({ data });

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("token", "t");
});

describe("ChallengeForm (create)", () => {
  it("creates a challenge and navigates to it", async () => {
    api.get.mockImplementation(authGet({}));
    api.post.mockResolvedValue({ data: { _id: "c9" } });
    renderWithProviders(<ChallengeForm />, {
      route: "/create_challenge",
      path: "/create_challenge"
    });

    await userEvent.type(await screen.findByLabelText(/Title/), "Compost at home");
    await userEvent.selectOptions(screen.getByLabelText(/Category/), "Energy");
    await userEvent.type(screen.getByLabelText(/Description/), "Get a bin");
    await userEvent.click(screen.getByRole("button", { name: "Create challenge" }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/challenges", {
        title: "Compost at home",
        category: "Energy",
        gaia_points: 10,
        description: "Get a bin"
      })
    );
    expect(screen.getByTestId("other-route")).toBeInTheDocument();
  });

  it("requires title and description", async () => {
    api.get.mockImplementation(authGet({}));
    renderWithProviders(<ChallengeForm />, {
      route: "/create_challenge",
      path: "/create_challenge"
    });

    await userEvent.click(
      await screen.findByRole("button", { name: "Create challenge" })
    );
    expect(await screen.findByText("All fields are required")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("surfaces API validation errors", async () => {
    api.get.mockImplementation(authGet({}));
    api.post.mockRejectedValue({
      response: { data: { errors: [{ msg: "title is required" }] } }
    });
    renderWithProviders(<ChallengeForm />, {
      route: "/create_challenge",
      path: "/create_challenge"
    });

    await userEvent.type(await screen.findByLabelText(/Title/), "X");
    await userEvent.type(screen.getByLabelText(/Description/), "Y");
    await userEvent.click(screen.getByRole("button", { name: "Create challenge" }));

    expect(await screen.findByText("title is required")).toBeInTheDocument();
  });
});

describe("ChallengeForm (edit)", () => {
  const existing = {
    _id: "c1",
    title: "Old title",
    category: "Waste",
    gaia_points: 15,
    description: "Old description"
  };

  it("prefills the form and saves changes", async () => {
    api.get.mockImplementation(url =>
      url === "/api/auth"
        ? Promise.resolve({ data: TEST_USER })
        : Promise.resolve({ data: existing })
    );
    api.put.mockResolvedValue({ data: { _id: "c1" } });

    renderWithProviders(<ChallengeForm />, {
      route: "/edit_challenge/c1",
      path: "/edit_challenge/:id"
    });

    const title = await screen.findByLabelText(/Title/);
    await waitFor(() => expect(title).toHaveValue("Old title"));

    await userEvent.clear(title);
    await userEvent.type(title, "New title");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/api/challenges/c1", {
        title: "New title",
        category: "Waste",
        gaia_points: 15,
        description: "Old description"
      })
    );
  });
});
