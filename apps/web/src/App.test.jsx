import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

vi.mock("./api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}));
vi.mock("mapbox-gl", () => ({ default: {} }));

describe("App", () => {
  it("renders the landing page on /", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Reduce your footprint/)).toBeInTheDocument()
    );
    expect(screen.getByText("Be part of the change")).toBeInTheDocument();
  });
});
