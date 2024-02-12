"use client";
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { fetchExperiments, getNextDate, getPreviousDate, fetchExperimentsByDate} from '@/app/lib/data';

// TODO: Merge the buttons to avoid repetition.
export function NextExperiment() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
  
    async function handleClick() {
        const params = new URLSearchParams(searchParams);
        const experiments = fetchExperiments();
        var index = Number(searchParams.has("index") ? searchParams.get("index") : 0);
        var date = searchParams.get("date");
        if (date == null) {
          date = experiments[experiments.length-1].date.toDateString();
        }
      
        var experimentsInDate = fetchExperimentsByDate(date);
        if (experimentsInDate.length == 0 || index == experimentsInDate.length - 1) {
         date = getNextDate(new Date(date), experiments).toString(); 
         experimentsInDate = fetchExperimentsByDate(date);
         params.set("date", date);
         params.set("index", '0');
        } else {
            params.set("index", (index + 1).toString());
        }
  
        replace(`${pathname}?${params.toString()}`);
      }

    return (
        <>
          <button className="rounded-md border p-2 hover:bg-gray-100" onClick={handleClick}>
            <span className="sr-only">Next</span>
            <ArrowRightIcon className="w-5" />
          </button>
        </>
      );
}

export function PreviousExperiment() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleClick() {
        const params = new URLSearchParams(searchParams);
        const experiments = fetchExperiments();
        var index = Number(searchParams.has("index") ? searchParams.get("index") : 0);
        var date = searchParams.get("date");
        if (date == null) {
          date = experiments[experiments.length-1].date.toString();
        }
      
        var experimentsInDate = fetchExperimentsByDate(date);
        if (index == 0) {
         date = getPreviousDate(new Date(date), experiments).toString(); 
         experimentsInDate = fetchExperimentsByDate(date);
         params.set("date", date);
         params.set("index", (experimentsInDate.length -1).toString());
        } else {
            params.set("index", (index - 1).toString());
        }
  
        replace(`${pathname}?${params.toString()}`);
      }
    return (
        <>
          <button className="rounded-md border p-2 hover:bg-gray-100" onClick={handleClick}>
            <span className="sr-only">Previous</span>
            <ArrowLeftIcon className="w-5" />
          </button>
        </>
      );
}
