import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategorizationForm from "../src/components/ProposalCategorization/CategorizationForm.jsx";

describe('CategorizationForm', () => {
  it('should render initial state correctly', () => {
    // Mock the required props
    const mockProps = {
      allCycles: [],
      modalFile: '',
      mode: 'PROP',
      renderTableComponent: vi.fn(),
      button_label: 'Submit'
    };

    render(<CategorizationForm {...mockProps} />);

    expect(screen.getByText('Start a new process')).toBeDefined();

    // Check that the cycle selection container is present
    expect(screen.queryByTestId('cycle-selection-container')).toBeDefined();

    // Check that the config options are present
    expect(screen.queryByTestId('config-options-container')).toBeDefined();

    // Check that the logs container is not present
    expect(screen.queryByTestId('logs-container')).toBeNull();

    // Check that the table container is not present
    expect(screen.queryByTestId('table-container')).toBeNull();

    // Verify that renderTableComponent was not called
    expect(mockProps.renderTableComponent).not.toHaveBeenCalled();
  });
});
