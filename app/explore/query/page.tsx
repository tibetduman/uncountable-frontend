import { roboto } from '@/app/ui/fonts';
import QueryDisplay from "@/app/ui/query/query-display";
import React, {Suspense} from 'react';
import { Loading } from "@/app/lib/utils";

export default async function Page() {
  return (
    <div>
      <title>ExperimentViz - Query</title>
      <h1 className={`${roboto.className} text-left text-xl md:text-3xl bg-gray-50 p-3`}>
          Search and Filter Experiments
      </h1>
      <div>
        <Suspense fallback={<Loading />}>
          <QueryDisplay/>
        </Suspense>
      </div>
    </div>
  );
}