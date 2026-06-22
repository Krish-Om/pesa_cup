import API_BASE_URL from "./config";

const fixturesEndpoint = `${API_BASE_URL}/fixtures`;

const getAllFixtures = async () => {
    try {
        const result = await fetch(fixturesEndpoint);
        if (!result.ok) {
            throw new Error("Failed to fetch fixtures data");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching fixtures data:", error);
        throw error;
    }
};

const getFixtureById = async (id) => {
    try {
        const result = await fetch(`${fixturesEndpoint}/${id}`);
        if (!result.ok) {
            throw new Error("Failed to fetch fixture data");
        }
        return await result.json();
    } catch (error) {
        console.error("Error fetching fixture data:", error);
        throw error;
    }
};

export const FixturesAPI = {
    getAllFixtures,
    getFixtureById
};