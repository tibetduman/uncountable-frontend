import { fetchExperiments, fetchExperimentsByDate} from "@/app/lib/data";
import { Suspense } from 'react';
import { roboto } from '@/app/ui/fonts';
import ExperimentView from "@/app/ui/details/experiment-view";
import DatePickerComponent from "@/app/ui/details/date-picker";
import { NextExperiment, PreviousExperiment } from "@/app/ui/details/button";
import { Loading } from '@/app/lib/utils';

export default function Page({
  searchParams,
}: {
  searchParams?: {
    date?: string;
    index?: string;
  };
}) {
  const experiments = fetchExperiments();

  var date = searchParams?.date || experiments[experiments.length-1].date.toDateString();
  var index = Number(searchParams?.index) || 0;

  var experimentsInDate = fetchExperimentsByDate(date);
  const experimentIdentifier = experimentsInDate.length > 0 ? 
    experimentsInDate[index].identifier : null;
  
  const experimentDisplay = experimentsInDate.length > 0 ? 
  experimentsInDate[index].display() : "No Experiment";

    return (
      <div className="w-full flex flex-col h-full">
      <title>ExperimentViz - Details</title>
      <h1 className={`${roboto.className} text-left text-xl md:text-3xl bg-gray-50 p-3`}>
          Experiment Details
      </h1>
      <div className="flex w-full items-center justify-left gap-4">
        <DatePickerComponent placeholder= {date}></DatePickerComponent>
        <PreviousExperiment></PreviousExperiment>
        <h1 className={`${roboto.className} text-2xl`}>{experimentDisplay}</h1>
        <NextExperiment></NextExperiment>
      </div>
      <Suspense fallback={<Loading />}>
      <ExperimentView identifier={experimentIdentifier} experiments={experiments}></ExperimentView>
        </Suspense>
    </div>
    )
  }