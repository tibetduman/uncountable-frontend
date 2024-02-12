// Restriction.ts
export class Restriction {
    name: string;
    absoluteMin: number;
    absoluteMax: number;
    currentMinValue: number;
    currentMaxValue: number;
    parameterType: string;
  
    constructor(name: string, absoluteMin: number, absoluteMax: number, currentMinValue: number, currentMaxValue: number, parameterType: string) {
      this.name = name;
      this.absoluteMin = absoluteMin;
      this.absoluteMax = absoluteMax;
      this.currentMinValue = currentMinValue;
      this.currentMaxValue = currentMaxValue;
      this.parameterType = parameterType;
    }
  
    updateCurrentMinValue(newValue: number): void {
      // Ensure the new value does not exceed the absolute maximum or is less than the absolute minimum
      if (newValue >= this.absoluteMin && newValue <= this.currentMaxValue) {
        this.currentMinValue = newValue;
      } else {
        console.log("New value for currentMinValue is out of bounds");
      }
    }
  
    updateCurrentMaxValue(newValue: number): void {
      // Ensure the new value does not exceed the absolute maximum or is less than the current minimum value
      if (newValue <= this.absoluteMax && newValue >= this.currentMinValue) {
        this.currentMaxValue = newValue;
      } else {
        console.log("New value for currentMaxValue is out of bounds");
      }
    }

    toJSON(): string {
      return JSON.stringify({
        name: this.name,
        absoluteMin: this.absoluteMin,
        absoluteMax: this.absoluteMax,
        currentMinValue: this.currentMinValue,
        currentMaxValue: this.currentMaxValue,
        parameterType: this.parameterType
      });
    }
  
    // fromJSON static method - Creates an instance from a JSON string
    static fromJSON(jsonString: string): Restriction {
      const jsonObj = JSON.parse(jsonString);
      return new Restriction(
        jsonObj.name,
        jsonObj.absoluteMin,
        jsonObj.absoluteMax,
        jsonObj.currentMinValue,
        jsonObj.currentMaxValue,
        jsonObj.parameterType
      );
    }
  }
  