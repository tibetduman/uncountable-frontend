import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Rectangle } from "@/app/ui/explore/rectangle";

const BUCKET_NUMBER = 4;
const BUCKET_PADDING = 4;

type HistogramProps = {
  width: number;
  height: number;
  data: number[];
};

export default function Histogram({ width, height, data }: HistogramProps) {
  const MARGIN = { top: height / 10, right: width / 10, bottom: height / 10, left: width / 10 };
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const domainMin = Math.min(...data) - Math.min(...data) % BUCKET_NUMBER;
  const domainMax = Math.max(...data) + BUCKET_NUMBER - (Math.max(...data) % BUCKET_NUMBER);

  const domain: [number, number] = [domainMin, domainMax];
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(domain).range([0, boundsWidth]);
  }, [data, width]);

  const bucketSize = (domainMax - domainMin) / BUCKET_NUMBER;
  const thresholds = Array.from({ length: BUCKET_NUMBER }, (_, i) => domainMin + i * bucketSize)

  const bucketGenerator = d3
  .bin()
  .value((d) => d)
  .domain(domain)
  .thresholds(thresholds);

  const buckets = bucketGenerator(data);

  const yScale = useMemo(() => {
    const max = Math.max(...buckets.map((bucket) => bucket?.length));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [data, height]);

  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const allRects = buckets.map((bucket, i) => {
    const { x0, x1 } = bucket;
    if (x0 == undefined || x1 == undefined) {
      return null;
    }
    const bucketWidth = xScale(x1) - xScale(x0) - BUCKET_PADDING;
    return (
      <Rectangle
        key={i}
        x={xScale(x0) + BUCKET_PADDING / 2}
        width={bucketWidth > 0 ? bucketWidth : 0}
        y={yScale(bucket.length)}
        height={boundsHeight - yScale(bucket.length)}
      />
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
      </g>
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      />
    </svg>
  );
};