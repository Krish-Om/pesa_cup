//tournament stats
import API_BASE_URL from "./config";

const statisticsEndpoint = `${API_BASE_URL}/tournament`;

const getTournamentStatistics = async () => {
    try {
        const result = await fetch(statisticsEndpoint);
        if (!result.ok) {
            throw new Error("Failed to fetch tournament statistics");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching tournament statistics:", error);
        throw error;
    }
};

export const StatisticsAPI = {
    getTournamentStatistics
};