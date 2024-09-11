import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CategorizationPage from '../src/components/ProposalCategorization/CategorizationPage';
import * as Api from '../src/components/util/Api';

// Mock the Api module
vi.mock('../util/Api', () => ({
  fetchTableData: vi.fn(),
  terminateCurrentProcess: vi.fn(),
}));

// Mock the EventSource
class MockEventSource {
  constructor(url) {
    this.url = url;
    this.onmessage = vi.fn();
    this.onerror = vi.fn();
    this.close = vi.fn();
  }
}

global.EventSource = MockEventSource;

const mockProps = {
  allCycles: [
    {
      cycleNumber: "221026",
      label: "221026",
      style: { backgroundColor: "" },
    },
  ],
  modalFile: ["strolger_pacman_model_7cycles.joblib"],
  setModalFile: vi.fn(),
  logLevelOptions: ["INFO", "DEBUG", "WARNING", "ERROR"],
};

describe('CategorizationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('it renders the logs-container div after the submit button is clicked', async () => {
    render(<CategorizationPage {...mockProps} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Cycle/i), { target: { value: '221026' } });
    fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'Test Run' } });
    fireEvent.change(screen.getByLabelText(/Log Level/i), { target: { value: 'INFO' } });

    // Click the submit button
    fireEvent.click(screen.getByText('Categorize Proposals'));

    // Wait for the logs container to appear
    await waitFor(() => {
      expect(screen.getByTestId('log-container')).toBeInTheDocument();
    });
  });

  test('it shows a "See Results" button after logs streaming is done, and clicking it shows the table container', async () => {
    render(<CategorizationPage {...mockProps} />);

    // Fill out the form and submit
    fireEvent.change(screen.getByLabelText(/Cycle/i), { target: { value: '221026' } });
    fireEvent.change(screen.getByLabelText(/Run Name/i), { target: { value: 'Test Run' } });
    fireEvent.change(screen.getByLabelText(/Log Level/i), { target: { value: 'INFO' } });
    fireEvent.click(screen.getByText('Categorize Proposals'));

    // Simulate log streaming completion
    await waitFor(() => {
      const eventSource = new EventSource('/api/stream/mock-task-id');
      eventSource.onmessage({ data: 'PROCESS COMPLETE' });
    });

    // Mock successful table data fetch
    Api.fetchTableData.mockResolvedValue({ tabularData: [], code: 200 });

    // Wait for the "See Results" button to appear and click it
    await waitFor(() => {
      const seeResultsButton = screen.getByText('See Results');
      expect(seeResultsButton).toBeInTheDocument();
      fireEvent.click(seeResultsButton);
    });

    // Check that the table container is now visible and the log container is hidden
    await waitFor(() => {
      expect(screen.queryByTestId('log-container')).not.toBeInTheDocument();
      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });
  });
});