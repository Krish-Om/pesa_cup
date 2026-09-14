import API_BASE_URL from "./config";

const tournamentsEndpoint = `${API_BASE_URL}/tournaments`;

const getAllTournaments = async () => {
  try {
    const result = await fetch(tournamentsEndpoint);
    if (!result.ok) {
      const data = await result.json().catch(() => null);
      throw new Error(data?.message || "Failed to fetch tournaments");
    }
    return await result.json();
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    throw error;
  }
};

const getTournamentById = async (id) => {
  try {
    const result = await fetch(`${tournamentsEndpoint}/${id}`);
    if (!result.ok) {
      const data = await result.json().catch(() => null);
      throw new Error(data?.message || "Failed to fetch tournament detail");
    }
    return await result.json();
  } catch (error) {
    console.error(`Error fetching tournament ${id}:`, error);
    throw error;
  }
};

export const TournamentsAPI = {
  getAllTournaments,
  getTournamentById,
};
