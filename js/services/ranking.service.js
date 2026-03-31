async function fetchRankingData() {
  try {
    const response = await fetch('./ressources/data/ranking.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching ranking data:", error);
    return []; // Devolvemos array vacío para que la app no crashee
  }
}