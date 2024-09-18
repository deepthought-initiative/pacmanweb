import {
    it,
    expect,
    vi,
    afterEach,
    afterAll,
    describe,
    beforeAll,
  } from "vitest";
  import {
    render,
    screen,
    cleanup,
    waitFor,
  } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { http, HttpResponse } from "msw";
  import { setupServer } from "msw/node";
  import "@testing-library/jest-dom/vitest";
  import CategorizationForm from "../src/components/ProposalCategorization/CategorizationForm.jsx";
  
  afterEach(cleanup);
  
  const server = setupServer(
    http
      .get("/api/run_pacman", () => {
        window.console.log("mock server");
        return HttpResponse.json({
          output:
            "PACMan running with task id 4c9cd774-6180-4df9-930c-96cf664d0793",
          result_id: "4c9cd774-6180-4df9-930c-96cf664d0793",
        });
      }),
      http.get(
        "/api/stream/4c9cd774-6180-4df9-930c-96cf664d0793",
        async ({ request }) => {
          window.console.log("mock log server request");
          const stream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              const messages = [
                "STARTING RUN",
                "Log file can be found",
                "PROCESS COMPLETE",
              ];
  
              for (const message of messages) {
                const data = encoder.encode(`data: ${message}\n\n`);
                console.log("data", data);
                controller.enqueue(data);
                await new Promise((resolve) => setTimeout(resolve, 100));
              }
  
              controller.close();
            },
          });
  
          return new HttpResponse(stream, {
            headers: {
              "Content-Type": "text/event-stream",
            },
          });
        }
      )
  );
  
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
  
  describe("CategorizationForm", () => {
    // Base props that will be used in all tests
    const baseProps = {
      allCycles: [
        {
          cycleNumber: "221026",
          label: "221026",
          style: { backgroundColor: "" },
        },
      ],
      modalFile: ["strolger_pacman_model_7cycles.joblib"],
      showLogs: false,
      showTable: false,
      button_label: "Submit",
      setCurrentTaskId: vi.fn(),
      setShowLogs: vi.fn(),
      startFetchingLogs: vi.fn(),
      loading: false,
      preventClick: vi.fn(),
      setLoading: vi.fn(),
      updateInputFields: vi.fn(),
      inputFields: {
        currentCycle: "",
        selectedModal: "",
        logLevel: "",
        runName: "",
        mode: "PROP",
      },
      logLevelOptions: ["INFO", "DEBUG", "WARNING", "ERROR"],
    };
  
    // Helper function to render component with custom props
    const renderComponent = (customProps = {}) => {
      const props = { ...baseProps, ...customProps };
      return render(<CategorizationForm {...props} />);
    };
  
    it("should render initial state correctly", () => {
      renderComponent()
      expect(screen.getByText("Start a new process")).toBeInTheDocument();
      expect(screen.getByText("Selected Current Cycle")).toBeInTheDocument();
      expect(screen.getByText("Other Options")).toBeInTheDocument();
      expect(screen.queryByText("Enter Run name(optional)")).toBeInTheDocument();
      expect(screen.queryByText("Select modal file to use")).toBeInTheDocument();
      expect(screen.queryByText("Select Log Level")).toBeInTheDocument();
    });
  
    it("should show logs and hide form when submit button is clicked", async () => {
      const mockProps = {
        allCycles: [
          {
            cycleNumber: "221026",
            label: "221026",
            style: {
              backgroundColor: "",
            },
          },
        ],
        modalFile: ["strolger_pacman_model_7cycles.joblib"],
        showLogs: false,
        showTable: false,
        button_label: "Submit",
        setCurrentTaskId: vi.fn(),
        setShowLogs: vi.fn(),
        startFetchingLogs: vi.fn(),
        loading: false,
        preventClick: vi.fn(),
        setLoading: vi.fn(),
        updateInputFields: vi.fn(),
        inputFields: {
          currentCycle: "221026",
          selectedModal: "strolger_pacman_model_7cycles.joblib",
          logLevel: "INFO",
          runName: "",
          mode: "PROP",
        },
        logLevelOptions: ["INFO", "DEBUG", "WARNING", "ERROR"],
      };
  
      renderComponent(mockProps)
  
      const submitButton = screen.getByText("Submit");
      await userEvent.click(submitButton);
  
      await waitFor(() => {
        expect(mockProps.setShowLogs).toHaveBeenCalledWith(true);
        expect(mockProps.startFetchingLogs).toHaveBeenCalled();
      });
    });
  
    it("should show validation errors when form is submitted without required fields", async () => {
      renderComponent()
      const submitButton = screen.getByText("Submit");
      await userEvent.click(submitButton);
  
      await waitFor(() => {
        expect(screen.getAllByText("Required")).toHaveLength(3);
      });
    });
  });
  