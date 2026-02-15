/**
 * Calculates the rankings for a list of teams based on the PRD tie-breaking logic.
 * 
 * Logic:
 * 1. Total Score (Highest wins)
 * 2. Ice Cream Fight Score (Highest wins)
 * 3. Dart Game Score (Highest wins)
 * 4. Balloon Between Us Score (Highest wins)
 * 5. Cup Stack & Knock Score (Highest wins)
 * 6. Alphabetical (A-Z)
 * 
 * @param {Array} teams - List of team objects
 * @returns {Array} - Sorted list of teams with 'rank' property added
 */
export const calculateRankings = (teams) => {
    // Helper to ensure numbers
    const getScore = (val) => Number(val) || 0;
  
    const sortedTeams = [...teams].sort((a, b) => {
      // 1. Total Score
      const totalA = getScore(a.iceCreamScore) + getScore(a.dartScore) + getScore(a.balloonScore) + getScore(a.cupStackScore);
      const totalB = getScore(b.iceCreamScore) + getScore(b.dartScore) + getScore(b.balloonScore) + getScore(b.cupStackScore);
      
      if (totalB !== totalA) return totalB - totalA;
  
      // 2. Ice Cream
      if (getScore(b.iceCreamScore) !== getScore(a.iceCreamScore)) {
        return getScore(b.iceCreamScore) - getScore(a.iceCreamScore);
      }
  
      // 3. Dart
      if (getScore(b.dartScore) !== getScore(a.dartScore)) {
        return getScore(b.dartScore) - getScore(a.dartScore);
      }
  
      // 4. Balloon
      if (getScore(b.balloonScore) !== getScore(a.balloonScore)) {
        return getScore(b.balloonScore) - getScore(a.balloonScore);
      }
  
      // 5. Cup Stack
      if (getScore(b.cupStackScore) !== getScore(a.cupStackScore)) {
        return getScore(b.cupStackScore) - getScore(a.cupStackScore);
      }
  
      // 6. Alphabetical
      return a.name.localeCompare(b.name);
    });
  
    // Assign Ranks (1-based index)
    return sortedTeams.map((team, index) => ({
      ...team,
      rank: index + 1,
      totalScore: getScore(team.iceCreamScore) + getScore(team.dartScore) + getScore(team.balloonScore) + getScore(team.cupStackScore)
    }));
  };
