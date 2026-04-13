import { memo, useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { buildSandboxEdges, buildSandboxNodes } from "./thoughtLoopDummyData";
import type { FocusPayload, ThoughtLoop } from "./types";

type BuildYourLoopProps = {
  loop: ThoughtLoop;
  onFocus: (payload: FocusPayload) => void;
};

function BuildYourLoop({ loop, onFocus }: BuildYourLoopProps) {
  const initialNodes = useMemo(() => buildSandboxNodes(loop), [loop]);
  const initialEdges = useMemo(() => buildSandboxEdges(loop), [loop]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((edge) => ({ ...edge, markerEnd: { type: MarkerType.ArrowClosed } }))
  );
  const [selectedNode, setSelectedNode] = useState<string>("Trigger");

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            markerEnd: { type: MarkerType.ArrowClosed },
            animated: true,
            style: { stroke: "#86d6e4" },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_event, node) => {
      const label = typeof node.data?.label === "string" ? node.data.label : "Trigger";
      setSelectedNode(label);
      onFocus({ loopId: loop.id, stage: label as FocusPayload["stage"] });
    },
    [loop.id, onFocus]
  );

  const mockInsight = useMemo(
    () =>
      `This loop appears to convert ${loop.emotion.toLowerCase()} into delay, then uses short-term relief as evidence that the current strategy is protective.`,
    [loop.emotion]
  );

  return (
    <div className="grid h-[460px] grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0f1732]/80 shadow-[0_12px_30px_rgba(2,7,18,0.35)]">
        <ReactFlow
          nodes={nodes}
          edges={edges as Edge[]}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          defaultEdgeOptions={{ animated: true }}
        >
          <Background color="rgba(183, 207, 255, 0.18)" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="rounded-2xl border border-white/12 bg-[#10182f]/82 p-4 text-sm text-slate-200/82">
        <p className="text-xs uppercase tracking-[0.16em] text-white/50">AI Insight (Mock)</p>
        <p className="mt-3 leading-relaxed text-white/88">{mockInsight}</p>
        <div className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-cyan-100/90">Selected Node</p>
          <p className="mt-1 text-base text-cyan-50">{selectedNode}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(BuildYourLoop);
