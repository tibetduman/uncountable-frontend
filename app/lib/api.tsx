// api.ts

// Since the key is a date and dynamic, we define a more generic type for time series data.
export type TimeSeriesData = { [key: string]: number };

export type SentimentResult = { negative: number, neutral: number, positive: number };

export type StockData = { [key: string]: number }

const sentiment_api = "http://127.0.0.1:5000/get_sentiment";
const interactivity_api = "http://127.0.0.1:5000/get_interaction";
const stock_api = "http://127.0.0.1:5000/get_stock";

interface TimeGraphApiResponse {
    interactity_data: TimeSeriesData[];
    success: boolean;
}


interface SentimentApiResponse {
    sentiment_result: SentimentResult;
    success: boolean;
}

interface StockApiResponse {
    stock_data: StockData[];
    success: boolean;
}

// Update the fetchBarGraphData function to correctly return a SentimentResult
export const fetchBarGraphData = async (companyName: string): Promise<SentimentResult> => {
    console.log("Trying fetch bar graph for ", companyName);
    try {
        const response = await fetch(sentiment_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_name: companyName })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log("The data for fetch bar graph for company is ", companyName, data);

        if (data.success && data.sentiment_result) {
            // Directly return the sentiment result if successful
            return data.sentiment_result;
        }
        throw new Error('API response unsuccessful or missing data.');
    } catch (error) {
        console.error("Failed to fetch bar graph data", error);
        // Return a default object in case of error
        return { negative: 0, neutral: 0, positive: 0 };
    }
};


// api.tsx

export const fetchTimeSeriesData = async (companyName: string): Promise<TimeSeriesData[]> => {
    console.log("trying fetch time series for ", companyName);
    try {
        const response = await fetch(interactivity_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_name: companyName })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log("the data for fetch time series for company is ",companyName, data);

        if (data.success && data.interactity_data) {
            return data.interactity_data.map((item: any) => {
                // Assuming each item is an object with a single key-value pair
                const time = Object.keys(item)[0];
                const value = item[time];
                return { time, value };
            });
        }
        throw new Error('API response unsuccessful or missing data.');
    } catch (error) {
        console.error("Failed to fetch time series data", error);
        return [];
    }
};


export const fetchStockData = async (companyName: string): Promise<StockData[]> => {
    console.log("trying fetch stock data for ", companyName);
    try {
        const response = await fetch(stock_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_name: companyName })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        console.log("the data for fetch time series for company is ",companyName, data);

        if (data.success && data.stock_data) {
            return data.stock_data.map((item: any) => {
                // Assuming each item is an object with a single key-value pair
                const time = Object.keys(item)[0];
                const value = item[time];
                return { time, value };
            });
        }
        throw new Error('API response unsuccessful or missing data.');
    } catch (error) {
        console.error("Failed to fetch time series data", error);
        return [];
    }
};


// Define the response structure expected from the API
interface ApiResponse<T> {
    data: T[];
    message?: string;
}

