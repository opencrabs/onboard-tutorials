import React from "react";
import { Composition } from "remotion";
import * as L1 from "./tutorial-linux/Tutorial";
import * as L2 from "./tutorial-macos/Tutorial";

export const Root: React.FC = () => (
  <>
    <Composition id="TutorialLinuxL1" component={L1.Tutorial} durationInFrames={L1.TOTAL} fps={L1.FPS} width={L1.W} height={L1.H} />
    <Composition id="TutorialMacosL2" component={L2.Tutorial} durationInFrames={L2.TOTAL} fps={L2.FPS} width={L2.W} height={L2.H} />
  </>
);
