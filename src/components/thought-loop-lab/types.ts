export type LoopStage =
  | "Trigger"
  | "Thought"
  | "Emotion"
  | "Action"
  | "Behavior"
  | "Reinforcement"
  | "Interruption";

export type LabModeId =
  | "infinity"
  | "galaxy"
  | "playback"
  | "builder"
  | "overgrown"
  | "whirlpool"
  | "mirrors"
  | "gravity"
  | "tabs-hell"
  | "echo"
  | "fork"
  | "energy";

export type LoopNode = {
  id: string;
  label: LoopStage;
  text: string;
};

export type ThoughtLoop = {
  id: string;
  title: string;
  description: string;
  trigger: string;
  coreThought: string;
  emotion: string;
  bodySignal: string;
  behavior: string;
  reinforcement: string;
  interruption: string;
  distortionPattern: string;
  distortionType: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  repeatCount: number;
  repetitionStrength: 1 | 2 | 3 | 4 | 5;
  cognitiveLoad: number;
  energyCost: number;
  perceivedChoices: string[];
  actualOutcome: string;
  beliefStrength: 1 | 2 | 3 | 4 | 5;
  metaphorTheme: "trail" | "vortex" | "mirror";
  accent: string;
  relatedLoops: string[];
  microThoughts: string[];
  observerInsights: string[];
  mirrorChain: {
    event: string;
    reflections: string[];
    distortionLabels: string[];
  };
  nodes: LoopNode[];
};

export type FocusPayload = {
  loopId: string;
  stage?: LoopStage;
  selectedItem?: string;
  observerNote?: string;
};
