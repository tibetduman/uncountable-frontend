"use client";
import { useState, useEffect } from "react";
import { DoubleSlider } from "@/app/ui/query/double-slider";
import { Restriction } from "@/app/lib/restriction";
import { allParameters, fetchExperiments, getRestrictionForParameter, filterExperiments } from "@/app/lib/data";
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import QueryTable from "@/app/ui/query/query-table";
import { recursive } from '@/app/ui/fonts';

export default function QueryDisplay() {
  const experiments = fetchExperiments();
  const allParameterNames = allParameters(experiments[0]);
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const [restrictions, setRestrictions] = useState<Map<string, Restriction>>(() => new Map());

  useEffect(() => {
    if (isClient) {
      const savedState = localStorage.getItem('restrictionState');
      if (savedState) {
        const parsedArray: [string, string][] = JSON.parse(savedState);
        const restrictionsMap = new Map<string, Restriction>();
        parsedArray.forEach(([key, valueJson]) => {
          restrictionsMap.set(key, Restriction.fromJSON(valueJson));
        });
        setRestrictions(restrictionsMap);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      const restrictionsArray = Array.from(restrictions.entries()).map(([key, restriction]) => {
        return [key, restriction.toJSON()];
      });
      localStorage.setItem('restrictionState', JSON.stringify(restrictionsArray));
    }
  }, [restrictions, isClient]);

  const [selectedParameter, setSelectedParameter] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState('');
  const validParameters: Set<string> = new Set();

  allParameterNames.forEach((_, paramName) => {
    if (!restrictions.has(paramName)) {
      validParameters.add(paramName);
    }
  });

  const maxOptionsToShow = 5;
  const filteredParameters = query === ''?
    Array.from(validParameters).slice(0, maxOptionsToShow) : 
    Array.from(validParameters).filter((paramName) => 
    paramName.toLowerCase().includes(query.toLowerCase())).slice(0, maxOptionsToShow);
  const defaultText: string = "Add new filter...";

  const handleAddRestriction = (searchInput: string) => {
    // Check if the input is not empty and the restriction is not already added
    if (searchInput && allParameterNames.has(searchInput) && !restrictions.has(searchInput)) {
      const newRestrictions = new Map(restrictions);
      const restrictionToAdd: Restriction = getRestrictionForParameter(searchInput, experiments);
      newRestrictions.set(searchInput, restrictionToAdd);
      setRestrictions(newRestrictions);
      setSelectedParameter("");
      setQuery("");
    }
  };

  const handleRemoveRestriction = (name: string) => {
    if (restrictions.has(name)) {
      const newRestrictions = new Map(restrictions);
      newRestrictions.delete(name);
      setRestrictions(newRestrictions);
    }
  };

  const handleSliderChange = (restrictionName: string, values: number[]) => {
    if (Array.isArray(values)) {
      const [min, max] = values;
      const newRestrictions = new Map(restrictions);
      const restriction = newRestrictions.get(restrictionName);
      if (restriction) {
        restriction.updateCurrentMinValue(min);
        restriction.updateCurrentMaxValue(max);
        setRestrictions(newRestrictions);
      }
    }
  };

  const renderSliders = () => {
    const sliders: JSX.Element[] = [];
    restrictions.forEach((restriction, paramName) => {
      sliders.push(
        <DoubleSlider
          key={paramName}
          restriction={restriction}
          onRemove={() => handleRemoveRestriction(paramName)}
          onChange={(values: number[]) => handleSliderChange(paramName, values)}
        />
      );
    });
    return sliders;
  };

  return (
    <div className={`${recursive.className} "bg-gray-50`}>
      <div>
        {renderSliders()}
      </div>
      <div className="my-4">
        <Combobox value={selectedParameter} onChange={(value: string) => {
          handleAddRestriction(value);
        }}>
        <div className="flex items-center w-full border border-gray-300 rounded-md">
          <div className="pl-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
          </div>
          <Combobox.Input
            className="w-full rounded-md p-2 border-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={defaultText}
            displayValue={(parameter: string) => parameter}
          />
        </div>
          <Combobox.Options>
            {filteredParameters.map((paramName) => (
              <Combobox.Option
                value={paramName}
                className="cursor-pointer p-2 hover:bg-blue-500 hover:text-white">
                {paramName}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
      <div>
        <QueryTable restrictions={Array.from(restrictions.values())} data={filterExperiments(experiments, Array.from(restrictions.values()))}></QueryTable>
      </div>
    </div>
  );
}