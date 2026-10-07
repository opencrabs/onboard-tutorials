import React from "react";
import { Composition } from "remotion";
import { Tutorial } from "./tutorial-linux/Tutorial";
import * as L from "./tutorial-linux/Tutorial";

export const Root: React.FC = () => (
  <>
    <Composition id="TutorialLinuxL1" component={Tutorial} durationInFrames={L.TOTAL} fps={L.FPS} width={L.W} height={L.H} />
  </>
);
