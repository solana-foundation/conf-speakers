import { render } from "@testing-library/react";
import { Gallery } from "./gallery";

describe("Gallery", () => {
  test("should render", () => {
    render(
      <Gallery
        images={[
          { src: "/placeholder1.png" },
          { src: "/placeholder2.png" },
          { src: "/placeholder1.png" },
          { src: "/placeholder1.png" },
          { src: "/placeholder2.png" },
          { src: "/placeholder2.png" },
          { src: "/placeholder1.png" },
          { src: "/placeholder2.png" },
        ]}
      />,
    );
  });
});
