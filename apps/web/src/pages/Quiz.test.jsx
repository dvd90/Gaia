import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import Quiz from "./Quiz";

vi.mock("../api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
import api from "../api";

beforeEach(() => vi.clearAllMocks());

const fillQuiz = async () => {
  const selects = screen.getAllByRole("combobox");
  // country: Armenia has countryCode "1" in the dataset
  await userEvent.selectOptions(selects[0], "1");
  await userEvent.selectOptions(selects[1], screen.getByRole("option", { name: "Vegan" }));
  await userEvent.selectOptions(selects[2], screen.getByRole("option", { name: "Never" }));
  await userEvent.selectOptions(selects[3], screen.getByRole("option", { name: "Bicycle" }));
};

describe("Quiz", () => {
  it("requires all answers before submitting", async () => {
    renderWithProviders(<Quiz />);
    await userEvent.click(screen.getByText("See my footprint"));
    expect(
      await screen.findByText("Please answer all the questions")
    ).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it("computes and stores the score, then navigates to the result", async () => {
    api.get.mockResolvedValue({ data: { earths: 1.5, countryName: "Armenia" } });
    renderWithProviders(<Quiz />, { route: "/quiz", path: "/quiz" });

    await fillQuiz();
    await userEvent.click(screen.getByText("See my footprint"));

    await waitFor(() =>
      expect(screen.getByTestId("other-route")).toBeInTheDocument()
    );
    // 1.5 (Armenia) + 0 (vegan) - 0.2 (never flies) + 0 (bicycle)
    expect(localStorage.getItem("score")).toBe("1.30");
    expect(api.get).toHaveBeenCalledWith("/api/footprint/1");
  });

  it("shows an error toast when the API fails", async () => {
    api.get.mockRejectedValue(new Error("down"));
    renderWithProviders(<Quiz />);

    await fillQuiz();
    await userEvent.click(screen.getByText("See my footprint"));

    expect(
      await screen.findByText("Could not compute your footprint, try again")
    ).toBeInTheDocument();
    expect(localStorage.getItem("score")).toBeNull();
  });
});
