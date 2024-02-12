import * as d3 from "d3";
import { AxisBottom } from "@/app/ui/explore/axis-bottom";
import { AxisLeft } from "@/app/ui/explore/axis-left";
import { useState } from "react";
import { Experiment } from "@/app/lib/experiment";
import { fetchExperiments, fetchExperimentIndex } from "@/app/lib/data";
import { useSearchParams, useRouter } from 'next/navigation';
import { colorGenerator } from "@/app/lib/utils";
import Tooltip from "@/app/ui/explore/tooltip";

//TODO: Data.ts method
function formatData(inputParam : string, outputParam: string) {
  const experiments = fetchExperiments();
  var data : {x : number, y: number, experiment: Experiment, index: number}[] = [];
  var minOutput : number;
  var maxOutput : number;
  var minInput : number;
  var maxInput : number;
  var index = 0;
  for (const experiment of experiments) {
    var x : number = experiment.inputs.get(inputParam) ?? 0;
    var y : number = experiment.outputs.get(outputParam) ?? 0;
    data.push({x, y, experiment, index})
  }
  maxInput = Math.max(...data.map(o => o.x))
  minInput = Math.min(...data.map(o => o.x))
  maxOutput = Math.max(...data.map(o => o.y))
  minOutput = Math.min(...data.map(o => o.y))
  return {data, minInput, maxInput, minOutput, maxOutput};
}


type ScatterplotProps = {
  width: number;
  height: number;
  inputParameter: string;
  outputParameter: string;
};

// Simplified version of a scatterplot
export default function Scatterplot({ width, height, inputParameter, outputParameter}: ScatterplotProps) {
  const MARGIN = { top: height / 10, right: width / 8, bottom: height / 6, left: width / 8 };
  const expData = formatData(inputParameter, outputParameter);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const searchParams = useSearchParams();
  const pathname = "explore/details/";
  const { replace } = useRouter();

  const [selectedCircle, setSelectedCircle] = useState<Experiment | null>(null);
  const [position, setPosition] = useState({ xPos: 0, yPos: 0 });


  function handleClick(experiment: Experiment) {
    const params = new URLSearchParams(searchParams);
    params.set("date", experiment.date.toDateString());
    params.set("index", fetchExperimentIndex(experiment.date.toDateString(), experiment.identifier).toString());

    replace(`${pathname}?${params.toString()}`);
  }

  // Scales
  const yScale = d3.scaleLinear().domain([expData.minOutput, expData.maxOutput]).range([boundsHeight, 0]);
  const xScale = d3
    .scaleLinear()
    .domain([expData.minInput, expData.maxInput])
    .range([0, boundsWidth]);
  const allShapes = expData.data.map((d, i) => {
    const className = d.experiment.identifier;

    return (
      <circle
        key={i}
        r={5}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        className={className}
        stroke={colorGenerator(className)}
        fill={colorGenerator(className)}
        onMouseOver={(event) => {
          setSelectedCircle(d.experiment);
          setPosition({ xPos: event.clientX, yPos: event.clientY });
        }}
        onMouseLeave={() => setSelectedCircle(null)}
        onClick={() => handleClick(d.experiment)}
      />
    );
  });

  return (
    <div className="flex justify-center">
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {/* Y axis */}
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

          {/* Y axis label */}
          <text
            transform={`translate(${-MARGIN.left + 50}, ${boundsHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {outputParameter}
          </text>

          {/* X axis, use an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              pixelsPerTick={40}
              height={boundsHeight}
            />
          </g>

          {/* X axis label */}
          <text
            transform={`translate(${boundsWidth / 2}, ${boundsHeight + MARGIN.bottom - 20})`}
            textAnchor="middle"
            alignmentBaseline="hanging"
          >
            {inputParameter}
          </text>

          {/* Circles */}
          {allShapes}
        </g>
      </svg>
      <Tooltip 
        selectedCircle={selectedCircle}
        position={position}
        xLabel={inputParameter}
        yLabel={outputParameter}
      />
    </div>
  );
  
};
