import { render } from "@testing-library/react";
import { mockSessions, mockSpeaker } from "@/__tests__/test-data";
import SessionSheet from "./session-sheet";

describe("SessionSheet", () => {
  test("should render", () => {
    render(
      <SessionSheet
        name={mockSessions[0].name}
        description={mockSessions[0].description}
        startTime={mockSessions[0].startTime}
        endTime={mockSessions[0].endTime}
        stage={mockSessions[0].stage}
        subscribeUrl={"#"}
        speakers={[mockSpeaker]}
      >
        <div>Test</div>
      </SessionSheet>,
    );
  });
});
