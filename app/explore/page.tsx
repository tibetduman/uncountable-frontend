import { roboto } from '@/app/ui/fonts';
import { SelectionDisplay } from '@/app/ui/explore/selection-display';
import { getInputColumnData, getOutputColumnData } from "@/app/lib/data";
import { Suspense } from 'react';
import { Loading } from '@/app/lib/utils';

export default function Page() {
  const inputPlotData : Map<string, number[]> = getInputColumnData();
  const outputPlotData : Map<string, number[]> = getOutputColumnData();
  return (
    <main>
      <div>
      <title>ExperimentViz - Explore</title>
        <h1 className={`${roboto.className} text-left text-xl md:text-3xl bg-gray-50 p-3`}>
          Explore Experiment Stats
      </h1>
      </div>
      <div>
        <Suspense fallback={<Loading />}>
        <SelectionDisplay inputPlotData={inputPlotData} outputPlotData={outputPlotData}></SelectionDisplay>
        </Suspense>
      </div>
    </main>
  );
}
