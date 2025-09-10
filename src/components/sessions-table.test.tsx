import { render } from "@testing-library/react";
import { mockSessions } from "@/__tests__/test-data";
import SessionsTable from "./sessions-table";

describe("SessionsTable", () => {
  test("should render", () => {
    render(<SessionsTable items={mockSessions} />);
  });
});
