import { formatDate } from "./utils";

export class Experiment {
    constructor(public identifier: string, public date: Date, public id: string, public num: number,
      public inputs: Map<string, number>, public outputs: Map<string, number>) {
    }

    static fromJSON(json: { [x: string]: any; }, identifier : string): Experiment {
        const dateAndId = identifier.split("_");
        const inputsData = json["inputs"];
        const outputsData = json["outputs"];
        var inputs: Map<string, number> = new Map<string, number>();
        var outputs: Map<string, number> = new Map<string, number>();
        Object.keys(inputsData).forEach(function(key) {
          inputs.set(key, inputsData[key]);
          })
          Object.keys(outputsData).forEach(function(key) {
            outputs.set(key, outputsData[key]);
          })
        return new Experiment(identifier, formatDate(dateAndId[0]), identifier, +dateAndId[2],
            inputs, outputs);
    }

    display() {
      return "Experiment " + this.num.toString();
    }
}
