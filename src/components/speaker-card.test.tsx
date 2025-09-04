import SpeakerCard from "./speaker-card";
import { render } from "@testing-library/react";
import { mockSpeaker } from "@/__tests__/test-data";

describe("SpeakerCard", () => {
  test("should render", () => {
    render(
      <SpeakerCard
        imageUrl={mockSpeaker.imageUrl}
        lastName={mockSpeaker.lastName!}
        firstName={mockSpeaker.firstName!}
        subscribeUrl={"#"}
        jobTitle={mockSpeaker.jobTitle}
        company={mockSpeaker.company}
        bio={mockSpeaker.bio}
        xLink={mockSpeaker.xLink}
        xName={mockSpeaker.xName}
      />,
    );
  });
});
