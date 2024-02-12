"use client";
import React from 'react';
import Histogram from '@/app/ui/explore/histogram';
import Scatterplot from '@/app/ui/explore/scatter-plot';
import { robotoBold, recursive } from '@/app/ui/fonts';

interface SelectionProps {
  inputPlotData: Map<string, number[]>;
  outputPlotData: Map<string, number[]>;
}

interface SelectionState {
  width: number;
  height: number;
  checkedInputRButton: string;
  checkedOutputRButton: string;
}

export class SelectionDisplay extends React.Component<SelectionProps, SelectionState>{
  constructor(props: SelectionProps) {
    super(props);
    this.state = {
      width: 800, // Default width
      height: 600, // Default height
      checkedInputRButton: "Polymer 1",
      checkedOutputRButton: "Viscosity",
    };
  }

  componentDidMount() {
    // Set the width and height based on the window's size after the component mounts
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      checkedInputRButton: localStorage.getItem('checkedInputRButton') || "Polymer 1",
      checkedOutputRButton: localStorage.getItem('checkedOutputRButton') || "Viscosity",
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // Remember to remove the listener when the component unmounts
    window.removeEventListener('resize', this.handleResize);
  }
  
  componentDidUpdate(prevProps: SelectionProps, prevState: SelectionState) {
    // Check if the state has changed before saving to localStorage
    if (prevState.checkedInputRButton !== this.state.checkedInputRButton) {
      localStorage.setItem('checkedInputRButton', this.state.checkedInputRButton);
    }

    if (prevState.checkedOutputRButton !== this.state.checkedOutputRButton) {
      localStorage.setItem('checkedOutputRButton', this.state.checkedOutputRButton);
    }
  }

  handleResize = () => {
    // Update the state with the new window size
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  handleClick = (groupName: string, e: string) => {
    if (groupName === "input") {
      this.setState({ checkedInputRButton: e });
    } else if (groupName === "output") {
      this.setState({ checkedOutputRButton: e });
    }
  };
  render() {
    return (
      <div>
        <div className="grid-cols-2 gap-6 bg-inherit grid mt-4 mb-10">
            <div className={`h-96 grid grid-cols-2 bg-neutral-100 border border-sky-500`}>
              <div className={`${robotoBold.className} col-span-1 bg-inherit text-center overflow-auto text-xl text-sky-500 my-6`}> Inputs
                {Array.from(this.props.inputPlotData).map(([key, value]) => (
                  <div className="flex overflow-auto my-1" key={key}>
                    <div className="mx-4">
                      <input type="radio" id={key} name={"input"} className="p-1" checked={key==this.state.checkedInputRButton}
                      onClick={() => this.handleClick("input", key)}>
                      </input>
                      <label htmlFor={key} className={`${recursive.className} text-left text-sm text-blue-950 mx-4`}>{key}</label>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${recursive.className} text-center text-l text-blue-800 col-span-1 bg-inherit my-8`}>
                <p>{this.state.checkedInputRButton} Distribution</p>
                <Histogram width={this.state.width / 6} height={this.state.height*4/10} data={this.props.inputPlotData.get(this.state.checkedInputRButton) ?? []} />
              </div>
            </div>
            <div className="grid grid-cols-2 bg-neutral-100 border border-sky-500 h-96">
              <div className={`${robotoBold.className} col-span-1 bg-inherit text-center overflow-auto text-xl text-sky-500 my-6`}> Outputs
                {Array.from(this.props.outputPlotData).map(([key, value]) => (
                  <div className="flex overflow-auto my-1" key={key}>
                      <div className='mx-4'>
                        <input type="radio" id={key} name={"output"} className="p-1 w-4 h-4" checked={key==this.state.checkedOutputRButton}
                          onClick={() => this.handleClick("output", key)}>
                          </input>
                          <label htmlFor={key} className={`${recursive.className} text-left text-sm text-blue-950 mx-4`}>{key}</label>
                      </div>
                  </div>
                ))}
              </div>
              <div className={`${recursive.className} text-center text-l text-blue-800 col-span-1 bg-inherit my-8`}>
                <p>{this.state.checkedOutputRButton} Distribution</p>
                <Histogram width={this.state.width / 6} height={this.state.height*4/10} data={this.props.outputPlotData.get(this.state.checkedOutputRButton) ?? []} />
              </div>
            </div>
        </div>
          <div className={`${recursive.className} text-center text-xl`}>
            <p className='font-semibold'> The effect of {this.state.checkedInputRButton} on {this.state.checkedOutputRButton}</p>
            <Scatterplot inputParameter={this.state.checkedInputRButton} outputParameter={this.state.checkedOutputRButton} width={this.state.width/3*2} height={this.state.height/2} />
          </div>
      </div>
    );
    }
  }