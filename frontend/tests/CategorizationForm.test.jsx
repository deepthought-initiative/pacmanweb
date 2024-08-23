import { render } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import CategorizationForm from "../src/components/ProposalCategorization/CategorizationForm.jsx";


vi.mock("../src/path/to/createDropdownObjects", () => ({
    createDropdownObjects: vi.fn(() => []), // Return an empty array or any mock data
  }));

  
test("renders correctly initially", () => {
  const { getByText } = render(<CategorizationForm />);

  expect(getByText("Start a new process")).toBeInTheDocument();
});