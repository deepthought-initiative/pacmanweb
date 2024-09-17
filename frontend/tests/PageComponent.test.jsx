import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import CategorizationPage from "../src/components/ProposalCategorization/CategorizationPage";

// Mock the CategorizationPage subcomponents
vi.mock("../src/components/ProposalCategorization/CategorizationForm", () => ({
  default: vi.fn(() => (
    <div data-testid="categorization-form">Categorization Form</div>
  )),
}));

vi.mock("../src/components/util/LogsContainer", () => ({
  default: vi.fn(() => <div data-testid="logs-container">Logs Container</div>),
}));

vi.mock("../src/components/ProposalCategorization/CategorizationTable", () => ({
  default: vi.fn(() => (
    <div data-testid="categorization-table">Categorization Table</div>
  )),
}));

describe("CategorizationPage", () => {
  let baseProps = {
    allCycles: [
      {
        cycleNumber: "221026",
        label: "221026",
        style: { backgroundColor: "" },
      },
    ],
    modalFile: [{ label: "strolger_pacman_model_7cycles.joblib" }],
    setModalFile: vi.fn(),
    logLevelOptions: [
      { label: "info" },
      { label: "debug" },
      { label: "warning" },
      { label: "critical" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show logs container after form submission and then show results table", async () => {
    const user = userEvent.setup();

    render(<CategorizationPage {...baseProps} />);

    // Check if the form is initially rendered
    expect(screen.getByTestId("categorization-form")).toBeInTheDocument();

    // Click the submit button
    await user.click(screen.getByText("Categorize Proposals"));

    // Check if the logs container appears
    await waitFor(() => {
      expect(screen.getByTestId("logs-container")).toBeInTheDocument();
    });

    // Simulate log completion by clicking a "See Results" button
    // (You might need to adjust this based on how your component actually transitions from logs to results)
    const seeResultsButton = await screen.findByText("See Results");
    await user.click(seeResultsButton);

    // Check if the categorization table is rendered
    await waitFor(() => {
      expect(screen.getByTestId("categorization-table")).toBeInTheDocument();
    });

    // Verify that the logs container is no longer present
    expect(screen.queryByTestId("logs-container")).not.toBeInTheDocument();
  });
});
