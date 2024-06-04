import axios, { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_CONVERTER_MIDDLEWARE;

// Interface for the input and output of the conversion functions
interface GramsToPoundsResponse {
    pounds: number[];
}

interface PoundsToGramsResponse {
    grams: number[];
}

interface GramsToMilligramsResponse {
    milligrams: number[];
}

interface TablespoonToTeaspoonResponse {
    teaspoons: number[];
}

// Function to convert metric to imperial (grams to pounds)
const convertMetricToImperial = async (grams: number[]): Promise<GramsToPoundsResponse | null> => {
    try {
        const response: AxiosResponse<GramsToPoundsResponse> = await axios.post(`${BASE_URL}/metric-to-imperial`, { grams });
        return response.data;
    } catch (error) {
        console.error('Error converting metric to imperial:', error);
        return null;
    }
};

// Function to convert imperial to metric (pounds to grams)
const convertImperialToMetric = async (pounds: number[]): Promise<PoundsToGramsResponse | null> => {
    try {
        const response: AxiosResponse<PoundsToGramsResponse> = await axios.post(`${BASE_URL}/imperial-to-metric`, { pounds });
        return response.data;
    } catch (error) {
        console.error('Error converting imperial to metric:', error);
        return null;
    }
};

// Function to convert metric to metric (grams to milligrams)
const convertMetricToMetric = async (grams: number[]): Promise<GramsToMilligramsResponse | null> => {
    try {
        const response: AxiosResponse<GramsToMilligramsResponse> = await axios.post(`${BASE_URL}/metric-to-metric`, { grams });
        return response.data;
    } catch (error) {
        console.error('Error converting metric to metric:', error);
        return null;
    }
};

// Function to convert imperial to imperial (tablespoon to teaspoon)
const convertImperialToImperial = async (tablespoon: number[]): Promise<TablespoonToTeaspoonResponse | null> => {
    try {
        const response: AxiosResponse<TablespoonToTeaspoonResponse> = await axios.post(`${BASE_URL}/imperial-to-imperial`, { tablespoon });
        return response.data;
    } catch (error) {
        console.error('Error converting imperial to imperial:', error);
        return null;
    }
};

export {
    convertMetricToImperial,
    convertImperialToMetric,
    convertMetricToMetric,
    convertImperialToImperial
};
