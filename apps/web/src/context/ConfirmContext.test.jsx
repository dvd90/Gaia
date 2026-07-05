import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmProvider, useConfirm } from "./ConfirmContext";

let lastResult;

const Probe = () => {
  const { confirm } = useConfirm();
  return (
    <button
      onClick={async () => {
        lastResult = await confirm({
          title: "Delete it?",
          text: "Gone forever.",
          confirmLabel: "Delete",
          danger: true
        });
      }}
    >
      open
    </button>
  );
};

const renderProbe = () =>
  render(
    <ConfirmProvider>
      <Probe />
    </ConfirmProvider>
  );

beforeEach(() => {
  lastResult = undefined;
});

describe("ConfirmProvider", () => {
  it("resolves true when confirmed", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Gone forever.")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Delete"));
    expect(lastResult).toBe(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("resolves false when cancelled", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("open"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(lastResult).toBe(false);
  });

  it("resolves false when clicking the backdrop", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("open"));
    await userEvent.click(document.querySelector(".modal-backdrop"));
    expect(lastResult).toBe(false);
  });

  it("uses a danger button style when asked", async () => {
    renderProbe();
    await userEvent.click(screen.getByText("open"));
    expect(screen.getByText("Delete")).toHaveClass("btn-danger");
  });
});
