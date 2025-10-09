// esportt/lib/referralNetworkAnalyzer.js

export class ReferralNetworkAnalyzer {
  static analyzeNetwork(playerEmail, referrals) {
    const adj = {};
    players.forEach(player => {
      adj[player.email] = player.referrals || [];
    });

    const visited = new Set();
    const queue = [];
    const levels = {};
    let depth = 0;

    queue.push(startEmail);
    visited.add(startEmail);
    levels[startEmail] = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      const currentLevel = levels[current];
      depth = Math.max(depth, currentLevel);

      for (const neighbor of adj[current] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          levels[neighbor] = currentLevel + 1;
        }
      }
    }

    return {
      depth,
      connections: Array.from(visited),
      levels
    };
  }
}
