// esportt/lib/activityAnalyzer.js

export class ActivityAnalyzer {
  // Find pairs of players whose skill levels sum to a target value
  findOptimalPairs(players, targetSkillSum) {
    // Sort players by skill level
    const sorted = [...players].sort((a, b) => a.skill - b.skill);
    const pairs = [];
    let left = 0;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[left].skill + sorted[right].skill;
      if (sum === targetSkillSum) {
        pairs.push({
          player1: sorted[left],
          player2: sorted[right],
          skillSum: sum
        });
        left++;
        right--;
      } else if (sum < targetSkillSum) {
        left++;
      } else {
        right--;
      }
    }
    return pairs;
  }
}
