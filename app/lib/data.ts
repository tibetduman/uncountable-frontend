var experimentData = require("./Dataset.json");
import { Experiment } from './experiment';
import { Restriction } from './restriction';

export function fetchExperiments() {
  var experiments : Experiment[] = [];
  Object.keys(experimentData).forEach(function(key) {
    experiments.push(Experiment.fromJSON(experimentData[key], key));
  })
  var sortedExperiments: Experiment[] = experiments.sort((e1, e2) => {
    if (e1.date != e2.date) {
      return e1.date > e2.date ? 1 : -1;
    }
    return e1.num - e2.num;
  })
  return sortedExperiments;
}

export function fetchExperimentsByDate(date : string) {
  // Returns the experiments corresponding to the date.
  // Defaults to an empty Experiment list.
  var experiments = fetchExperiments();
  var result : Experiment[] = [];
  experiments.forEach(experiment => {
    if (experiment.date.toDateString() == date) {
      result.push(experiment);
    }
  });
  return result;
}

export function fetchExperimentIndex(date: string, identifier: string) {
  const experiments: Experiment[] = fetchExperiments();
  
  // Filter experiments by date first
  const experimentsInDate: Experiment[] = experiments.filter(experiment => 
      experiment.date.toDateString() === date
  );
  
  // Then find the index of the experiment with the matching identifier
  const index = experimentsInDate.findIndex(experiment => 
      experiment.identifier === identifier
  );

  if (index !== -1) {
      return index;
  }
  return -1;
}

export function getNextDate(date : Date, experiments : Experiment[]) {
  // Returns the next date that is in the experiments list.
  var i : number = 0;
  while (i < experiments.length && experiments[i].date.getTime() <= date.getTime()) {
    i += 1;
  }
  return experiments[i % experiments.length].date.toDateString();
}

export function getPreviousDate(date : Date, experiments : Experiment[]) {
  // Returns the previous date that is in the experiments list.
  var i : number = experiments.length - 1;
  while (i >= 0 && experiments[i].date.getTime() >= date.getTime()) {
    i -= 1;
  }
  if (i < 0) {
    return experiments[experiments.length - 1].date.toDateString()
  }
  return experiments[i].date.toDateString();
}

export function fetchExperimentsByIdentifier(identifier : string, experiments : Experiment[]) {
  // Returns the experiment corresponding to the identifier.
  // Defaults to last experiment in the list.
  var result : Experiment = experiments[experiments.length-1];
  experiments.forEach(experiment => {
    if (experiment.identifier == identifier) {
      result = experiment;
    }
  });
  return result;
}

export function getInputColumnData() {
  var experiments = fetchExperiments();
  const result: Map<string, number[]> = new Map();
  for (const experiment of experiments) {
    experiment.inputs.forEach((value, key) => {
      if (!result.has(key)) {
        result.set(key, []);
      }

      result.get(key)?.push(value);
    });
  }
  return result;
}

export function getOutputColumnData() {
  var experiments = fetchExperiments();
  const result: Map<string, number[]> = new Map();
  for (const experiment of experiments) {
    experiment.outputs.forEach((value, key) => {
      if (!result.has(key)) {
        result.set(key, []);
      }

      result.get(key)?.push(value);
    });
  }
  return result;
}

export function fetchStatsForParameter(experiments : Experiment[], parameterName: string) {
  const allParams: Map<string, string> = allParameters(experiments[0]);
  if (allParams.get(parameterName) == "input") {
    let values: number[] = experiments.map(experiment => experiment.inputs.get(parameterName) || 0);
    let min: number = Math.min(...values);
    let max: number = Math.max(...values);
    let pType = "input";
    return { min, max, pType};
  } else {
    let values: number[] = experiments.map(experiment => experiment.outputs.get(parameterName) || 0);
    let min: number = Math.min(...values);
    let max: number = Math.max(...values);
    let pType = "output";
    return { min, max, pType };
  }
}

export function allParameters(experiment: Experiment) {
  // Returns all possible parameters.
  const parameters: Map<string, string> = new Map();
  experiment.inputs.forEach((_, key) => {
    parameters.set(key, "input");
  });
  experiment.outputs.forEach((_, key) => {
    parameters.set(key, "output");
  });

  return parameters;
}

export function getRestrictionForParameter(parameterName: string, experiments: Experiment[]) {
  const stats : {min: number, max:number, pType : string} = fetchStatsForParameter(experiments, parameterName);
  return new Restriction(parameterName, stats.min, stats.max, stats.min, stats.max, stats.pType);
}

export function filterExperiments(experiments: Experiment[], restrictions: Restriction[]) {
  // Returns the list of experiments that match the current restrictions.
  const result: Experiment[] = [];
  experiments.forEach((experiment: Experiment) => {
    var unfiltered = true;
    restrictions.forEach((restriction: Restriction) => {
      const parameterValues = restriction.parameterType === 'input' ?
        experiment.inputs : experiment.outputs;
      const value = parameterValues.get(restriction.name);
      if (value === undefined ||
         value < restriction.currentMinValue ||
         value > restriction.currentMaxValue) {
        unfiltered = false;
      }
    })
    if (unfiltered) {
      result.push(experiment);
    }
  })
  return result;
}