import { fetchExperimentsByIdentifier, getInputColumnData, getOutputColumnData } from "@/app/lib/data";
import { Experiment } from '@/app/lib/experiment.js';
import React from "react";
import { ParameterPlots } from "@/app/ui/details/parameter-plots";
import { recursive, robotoBold } from '@/app/ui/fonts';

export default function ExperimentView({identifier, experiments} : {identifier: string | null, experiments : Experiment[]}) {
  if (identifier == null) {
    return; // Don't display anything for a non-existing experiment.
  }
  const experiment : Experiment =  fetchExperimentsByIdentifier(identifier, experiments);
  const inputPlotData : Map<string, number[]> = getInputColumnData();
  const outputPlotData : Map<string, number[]> = getOutputColumnData();
  return (
    <div className="h-full flex-1 grid grid-cols-2 overflow-auto">
      <div className={`${recursive.className} "bg-gray-50  overflow-auto border-r-2 border-sky-200`} >
        <div className={`${robotoBold.className} text-center text-xl text-sky-500 mt-6 mb-6`}>
          Inputs
        </div>
        <ParameterPlots experiment={experiment.inputs} plotData={inputPlotData} type="input"></ParameterPlots>
      </div>
      <div className={`${recursive.className} "bg-gray-50 overflow-auto border-r-2 border-sky-200`}>
        <div className={`${robotoBold.className} text-center text-xl text-sky-500 mt-6 mb-6`}>
          Outputs
        </div>
        <ParameterPlots experiment={experiment.outputs} plotData={outputPlotData} type="output"></ParameterPlots>
      </div>
    </div>
  );
}

