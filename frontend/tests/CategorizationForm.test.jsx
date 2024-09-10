import { it, expect, vi, afterEach, afterAll, beforeAll } from 'vitest';
import { render, screen,fireEvent, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom/vitest';
import CategorizationForm from "../src/components/ProposalCategorization/CategorizationForm.jsx";

afterEach(cleanup);

const server = setupServer(
  http.get('/api/run_pacman', () => {
    window.console.log("mock server");
    return HttpResponse.json({ "output": "PACMan running with task id 4c9cd774-6180-4df9-930c-96cf664d0793", "result_id": "4c9cd774-6180-4df9-930c-96cf664d0793" }
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('should render initial state correctly', () => {
  const mockProps = {
    allCycles: [{
      cycleNumber: "221026",
      label: "2221026",
      style: {
        backgroundColor: ""
      }
    }],
    modalFile: [],
    mode: 'PROP',
    renderTableComponent: vi.fn(),
    button_label: 'Submit'
  };

  render(<CategorizationForm {...mockProps} />);
  expect(screen.getByText('Start a new process')).toBeDefined();
  expect(screen.queryByTestId('cycle-selection-container')).toBeDefined();
  expect(screen.queryByTestId('config-options-container')).toBeDefined();
  expect(screen.queryByTestId('logs-container')).not.toBeTruthy();
  expect(screen.queryByTestId('table-container')).toBeNull();
  expect(mockProps.renderTableComponent).not.toHaveBeenCalled();
});

it('should show logs and hide table when submit button is clicked', async () => {
  const mockProps = {
    allCycles: [{
      cycleNumber: "221026",
      label: "2221026",
      style: {
        backgroundColor: ""
      }
    }],
    modalFile: ["strolger_pacman_model_7cycles.joblib"],
    mode: 'PROP',
    renderTableComponent: vi.fn(),
    button_label: 'Submit',
    handleClick: vi.fn(),
    loading: false,
  };
  const cycleNumber = "221026";
  render(<CategorizationForm {...mockProps} />);
  const cycleDropdown = screen.getByTestId("dropdown-Selected Current Cycle");
  await userEvent.click(cycleDropdown);
  const cycleOption = screen.getByTestId(`dropdown-cycle-option-${cycleNumber}`);
  await userEvent.click(cycleOption);
  const submitButton = screen.getByTestId('submit-button');
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.queryByTestId('logs-container')).toBeInTheDocument();
    expect(screen.queryByTestId('table-container')).not.toBeInTheDocument();
  });

});