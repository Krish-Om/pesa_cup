import API_BASE_URL from "./config"; 

const scorersEndpoint = `${API_BASE_URL}/scorers`;

const getAllScorers = async () => {
    try {
        const result = await fetch(scorersEndpoint);
        if (!result.ok) {
            throw new Error("Failed to fetch scorers data");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching scorers data:", error);
        throw error;
    }
};

const getScorerById = async (id) => {
    try {
        const result = await fetch(`${scorersEndpoint}/${id}`);
        if (!result.ok) {
            throw new Error("Failed to fetch scorer data");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching scorer data:", error);
        throw error;
    }
};

export const ScorersAPI = {
    getAllScorers,
    getScorerById
};