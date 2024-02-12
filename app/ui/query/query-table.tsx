import React from 'react';
import { Restriction } from "@/app/lib/restriction";
import { Experiment } from "@/app/lib/experiment";
import DataTable from 'react-data-table-component';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchExperimentIndex } from "@/app/lib/data";

interface QueryTableProps {
    restrictions: Restriction[];
    data: Experiment[];
}

const QueryTable: React.FC<QueryTableProps> = ({ restrictions, data }) => {
    // Dynamically generate columns from restrictions
    const columns = [
        {
            name: 'Date',
            selector: (row: Experiment) => row.date.toISOString().split('T')[0],
            sortable: true,
        },
        {
            name: 'ID',
            selector: (row: Experiment) => row.display(),
            sortable: true,
        },
        ...restrictions.map(restriction => ({
            name: restriction.name,
            selector: (row: Experiment) => {
                const valueMap = restriction.parameterType === 'input' ? row.inputs : row.outputs;
                return valueMap.get(restriction.name) || 0;
            },
            sortable: true,
        }))
    ];
    const searchParams = useSearchParams();
    const pathname = "/explore/details/";
    const { replace } = useRouter();

    function handleClick(experiment: Experiment) {
        const params = new URLSearchParams(searchParams);
        params.set("date", experiment.date.toDateString());
        params.set("index", fetchExperimentIndex(experiment.date.toDateString(), experiment.identifier).toString().toString());
    
        replace(`${pathname}?${params.toString()}`);
      }

    return (
        <DataTable
            columns={columns}
            data={data}
            highlightOnHover={true}
            onRowClicked={(row: Experiment, e) => {handleClick(row)}}
        />
    );
};

export default QueryTable;
