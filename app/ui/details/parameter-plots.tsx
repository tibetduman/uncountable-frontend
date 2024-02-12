"use client";
import BoxWhiskerPlot from "@/app/ui/details/box-whisker-plot";
import React from "react";
import '@/app/ui/details/plot-styles.css';

interface PlotProps {
experiment: Map<string, number>
  plotData: Map<string, number[]>;
  type: string
}

interface PlotState {
  width: number;
  height: number;
}

export class ParameterPlots extends React.Component<PlotProps, PlotState> {
  constructor(props: PlotProps) {
    super(props);
    this.state = {
      width: 800,
      height: 600,
    };
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight});
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    // Immediately update dimensions in case the initial state is not accurate
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  render() {
    const plotWidth = this.state.width * 0.2; 
    const plotHeight = this.state.height * 0.07;
    //TODO: Make a component to avoid repetition.
    if (this.props.type == "input") {
      return (
        <>
          {Array.from(this.props.plotData).map(([key, value]) => {
            return (
              <div className="grid grid-cols-5 my-4">
                <div className="col-span-3 mx-4">
                <BoxWhiskerPlot data={value} property={key} point={this.props.experiment.get(key) ?? 0} width={plotWidth} height={plotHeight}></BoxWhiskerPlot>
                </div>
              <div className={`plot ${this.props.type} col-span-2 text-center translate-y-1/4`}>
                {key}
              </div>
              </div>
            );
          })}
        </>
      );
    }
    return (
      <>
        {Array.from(this.props.plotData).map(([key, value]) => {
          return (
            <div className="grid grid-cols-5 my-4">
              <div className={`plot ${this.props.type} text-center col-span-2 translate-y-1/4`}>
                {key}
              </div>
              <div className="col-span-3 mx-4">
              <BoxWhiskerPlot data={value} property={key} point={this.props.experiment.get(key) ?? 0} width={plotWidth} height={plotHeight}></BoxWhiskerPlot>
              </div>
            </div>
          );
        })}
      </>
    );
  }
}
