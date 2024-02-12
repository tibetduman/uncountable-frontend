import * as React from "react";
import * as d3 from 'd3';
import PropsTypes from 'prop-types';

const STROKE_WIDTH = 2;

// TODO: Move to Data.ts
function getSummaryStats(data: number[])  {
    const sortedData = data.sort(d3.ascending);
  
    const q1 = d3.quantile(sortedData, .25)
    const median = d3.quantile(sortedData, .5)
    const q3 = d3.quantile(sortedData, .75)
    if (q1 === undefined || q3 === undefined || median === undefined) {
        return;
    }
  
    const mean = d3.sum(sortedData) / sortedData.length;
    const min = sortedData[0];
    const max = sortedData[sortedData.length-1];
  
    return {min, q1, mean, q3, max}
  }

function translateData(data: number[], point: number, width: number) {
    const minVal = d3.min(data) ?? 0;
    const maxVal = d3.max(data) ?? 1;
    const result : number[] = data.slice();
    for (let i = 0; i < data.length; i++) {
        result[i] = (data[i] - minVal) * width / (maxVal - minVal)
      };
    point = (point - minVal) * width / (maxVal - minVal);
    return {result, point};
}

  const HorizontalBox = ({
    min,
    q1,
    mean,
    q3,
    max,
    height,
    stroke,
    fill,
    p,
    val
  } :
  {
    min: number,
    q1: number,
    mean: number,
    q3: number,
    max: number,
    height: number,
    stroke: string,
    fill: string,
    p: number,
    val: number
  }) => {
    return (
      <>
        <line
          x1={min}
          x2={max}
          y1={height / 2}
          y2={height / 2}
          stroke={stroke}
          width={STROKE_WIDTH}
        />
        <rect
          x={q1}
          y={0}
          width={Math.max(q3-q1, 5)}
          height={height}
          stroke={stroke}
          fill={fill}
        />
        <line
          x1={mean}
          x2={mean}
          y1={0}
          y2={height}
          stroke={stroke}
          width={STROKE_WIDTH}
        />
        <line
          x1={min}
          x2={min}
          y1={0}
          y2={height}
          stroke={stroke}
          width={STROKE_WIDTH}
        />
        <line
          x1={max}
          x2={max}
          y1={0}
          y2={height}
          stroke={stroke}
          width={STROKE_WIDTH}
        />
        <circle
        cx={p}
        cy={height/2}
        r={3}>
        </circle>
        <text
        x={p}  // Horizontal position, aligns with the center of the circle
        y={height / 2 + 15}  // Vertical position, aligns with the center of the circle
        textAnchor="middle"  // Centers the text horizontally on x
        alignmentBaseline="middle"  // Centers the text vertically on y
        fontSize="14"  // Size of the text, adjust as needed
        fill="black" 
        fontWeight={600} // Color of the text
      >
        {val}
      </text>
      </>
    );
  };

interface BoxWhiskerProps {
  data: number[],
  point: number,
  height: number,
  width: number
}


function BoxWhiskerPlot({ data, point, height, width }: BoxWhiskerProps) {
  const MARGIN = { top: height / 10, right: width / 20, bottom: height / 10, left: width / 20 };
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const scaledData = translateData(data, point, boundsWidth);
  var stats = getSummaryStats(scaledData.result);

  return (
      <svg width={width} height={height}>
        <g transform="translate(10, 0)">
          <HorizontalBox
            min={stats?.min || 0}
            q1={stats?.q1 || 0}
            mean={stats?.mean || 0}
            q3={stats?.q3 || 0}
            max={stats?.max || 0}
            height={boundsHeight}
            stroke="#cb1dd1"
            fill={"#ead4f5"}
            p={scaledData.point}
            val={point}
          />
        </g>

    </svg>
      
  );
}

BoxWhiskerPlot.propTypes = {
    data: PropsTypes.array,
    property: PropsTypes.string,
    point: PropsTypes.number
  };

export default BoxWhiskerPlot;