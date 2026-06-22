import API_BASE_URL  from "./config";

const standingsEndpoint = `${API_BASE_URL}/standings`;
const getAllStandings = async () => {
    try {
        const result = await fetch(standingsEndpoint);
        if (!result.ok) {
            throw new Error("Failed to fetch standings data");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching standings data:", error);
        throw error;
    }
};

const getStandingsById = async (id) => {
    try {
        const result = await fetch(`${standingsEndpoint}/${id}`);
        if (!result.ok) {
            throw new Error("Failed to fetch standings data");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching standings data:", error);
        throw error;
    }
};

export const StandingsAPI = {
    getAllStandings,
    getStandingsById
};
