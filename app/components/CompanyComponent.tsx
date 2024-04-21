import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { fetchTimeSeriesData, fetchBarGraphData, TimeSeriesData, SentimentResult } from '@/app/lib/api'; 

interface CompanyComponentProps {
    companyName: string | null;
    onDiscard: () => void;
}

const CompanyComponent: React.FC<CompanyComponentProps> = ({ companyName, onDiscard }) => {
    const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
    const [barGraphData, setBarGraphData] = useState<SentimentResult>({ negative: 0, neutral: 0, positive: 0 });

    useEffect(() => {
        if (!companyName) {
            // Clear data if no company is selected
            setTimeSeriesData([]);
            setBarGraphData({ negative: 0, neutral: 0, positive: 0 });
            return; // Do not proceed to fetch data
        }

        console.log("loading data for", companyName);
        // Asynchronously fetch new data
        const loadData = async () => {
            const timeData = await fetchTimeSeriesData(companyName);
            const barData = await fetchBarGraphData(companyName);
            setTimeSeriesData(timeData);
            setBarGraphData(barData);
        };

        loadData();

    }, [companyName]); // Effect runs only when companyName changes

    const barChartData = [
        { name: 'Negative', value: barGraphData.negative },
        { name: 'Neutral', value: barGraphData.neutral },
        { name: 'Positive', value: barGraphData.positive }
    ];

    return (
        <div>
            <h3>{companyName}</h3>
            <button onClick={onDiscard}>Discard Company</button>
            <LineChart width={600} height={300} data={timeSeriesData}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
            </LineChart>
            <BarChart width={600} height={300} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" label={{ position: 'top' }} />
            </BarChart>
        </div>
    );
};

export default CompanyComponent;
