## Project Info
This project is for the Uncountable Front-End Assignment completed by Tibet Duman.

## The deployed website can be found [here](https://uncountable-frontend.vercel.app/)

The prompt is to build one or more views to help the users explore a dataset visually.

Given ideas are:
(1) Allow the user to select one or more properties and then display a scatterplot of those
properties
(2) Allow the user to select a measurement and a range of values for that measurements
and then display histograms that show which inputs were used to produce
measurements in that range
(3) Allow the user to filter on certain elements of the data and query the data

And the requirements are:
(1) The view(s) must be interactive. It must be able to produce different results based on
user input
(2) The interface should be aesthetically pleasing and/or a great UX experience

## SETUP

(1) Clone the respository localy
(2) Download the dependencies with a package manager like npm. (npm install)
(3) To run the dev environment execute: npm run dev
    After which you can access the website on: [local](http://localhost:3000/)
(4) To run the build environment execute: npm run build

Experiments: Inputs: 10000s Outputs: 100s

Milloins of experiments:
    A single experiment: Usually has 30ish inputs with 10 outputs

Experiments Table:
    Too many columns 10^5
    We would have too many Null entries in the rows

Outputs table: (100s of columns)
    Rows are experiments that have this specific output as non null

Inputs table: (too many columns)

Experiments, Inputs, Outputs

Column: paramID, bool input?, experimentID (the parameter belongs to), value
Each row: specfic input or output parameter

ParameterName Table:
    Columns: ID (unique), paramName



