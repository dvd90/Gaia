import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./ToastContext";

const Probe = () => {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast("Saved!")}>ok</button>
      <button onClick={() => toast("Boom", "error", 50)}>err</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <ToastProvider>
      <Probe />
    </ToastProvider>
  );

describe("ToastProvider", () => {
  it("shows a success toast", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("ok"));
    expect(screen.getByText("Saved!")).toHaveClass("toast-success");
  });

  it("auto-dismisses after the timeout", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("err"));
    expect(screen.getByText("Boom")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Boom")).not.toBeInTheDocument()
    );
  });

  it("dismisses on click", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("ok"));
    await userEvent.click(screen.getByText("Saved!"));
    expect(screen.queryByText("Saved!")).not.toBeInTheDocument();
  });

  it("throws when used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/inside <ToastProvider>/);
    spy.mockRestore();
  });
});
