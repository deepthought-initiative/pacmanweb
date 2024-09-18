import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CategorizationPage from "../src/components/ProposalCategorization/CategorizationPage";
import { ToastProvider } from "../src/context/ToastContext";

// Mock the subcomponents and API calls
vi.mock("../src/components/ProposalCategorization/CategorizationForm", () => ({
  default: vi.fn(({ setCurrentTaskId, setShowLogs, startFetchingLogs }) => (
    <div data-testid="categorization-form">
      <button onClick={() => {
        setCurrentTaskId("4c9cd774-6180-4df9-930c-96cf664d0793");
        setShowLogs(true);
        startFetchingLogs("4c9cd774-6180-4df9-930c-96cf664d0793");
      }}>
        Categorize Proposals
      </button>
    </div>
  )),
}));

vi.mock("../src/components/util/Logs", () => ({
  default: vi.fn(({ setShowTable, dataToDisplay }) => (
    <div data-testid="logs-container">
      Logs Container
      {dataToDisplay.length > 0 && (
        <button onClick={() => setShowTable(true)}>See Results</button>
      )}
    </div>
  )),
}));

vi.mock("../src/components/ProposalCategorization/CategorizationTable", () => ({
  default: vi.fn(() => (
    <div data-testid="categorization-table">Categorization Table</div>
  )),
}));

vi.mock("./Api.jsx", () => ({
  fetchTableData: vi.fn(() => Promise.resolve({ tabularData: [{ id: 1 }], code: 200 })),
  terminateCurrentProcess: vi.fn(),
}));

describe("CategorizationPage", () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      allCycles: [{ cycleNumber: "221026", label: "221026", style: { backgroundColor: "" } }],
      modalFile: [{ label: "strolger_pacman_model_7cycles.joblib" }],
      setModalFile: vi.fn(),
      logLevelOptions: [
        { label: "info" },
        { label: "debug" },
        { label: "warning" },
        { label: "critical" },
      ],
    };
    vi.clearAllMocks();
  });

  it("should show logs container after form submission and then show results table", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <CategorizationPage {...baseProps} />
      </ToastProvider>
    );

    // Check if the form is initially rendered
    expect(screen.getByTestId("categorization-form")).toBeInTheDocument();

    // Click the submit button
    await user.click(screen.getByText("Categorize Proposals"));

    // Check if the logs container appears
    await waitFor(() => {
      expect(screen.getByTestId("logs-container")).toBeInTheDocument();
    });

    // Simulate log completion and data fetching
    await waitFor(() => {
      expect(screen.getByText("See Results")).toBeInTheDocument();
    });

    // Click the "See Results" button
    await user.click(screen.getByText("See Results"));

    // Check if the categorization table is rendered
    await waitFor(() => {
      expect(screen.getByTestId("categorization-table")).toBeInTheDocument();
    });

    // Verify that the logs container is no longer present
    expect(screen.queryByTestId("logs-container")).not.toBeInTheDocument();
  });
});