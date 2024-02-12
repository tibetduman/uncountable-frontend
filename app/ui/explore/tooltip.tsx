import React from 'react';
import { Experiment } from "@/app/lib/experiment";

function Tooltip({ selectedCircle, position, xLabel, yLabel } : TooltipProps) {
  if (!selectedCircle) {
    return null; // If there is no selected circle, don't display the tooltip
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.xPos}px`,
    top: `${position.yPos}px`,
    padding: '3px',
    border: '1px solid #ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    pointerEvents: 'none',
    zIndex: 10,
    fontSize: "12px",
  };

  return (
    <div style={style}>
      <div><strong>Value:</strong> {selectedCircle.identifier}</div>
      <div><strong>{xLabel}:</strong> {selectedCircle.inputs.get(xLabel)}</div>
      <div><strong>{yLabel}:</strong> {selectedCircle.outputs.get(yLabel)}</div>
    </div>
  );
};

export default Tooltip;

type TooltipProps = {
    selectedCircle: Experiment | null;
    position: {xPos : number, yPos : number};
    xLabel: string;
    yLabel: string;
  };
