// esportt/lib/duplicateDetector.js

export class DuplicateDetector {
  constructor() {
    this.customerMap = new Map();
  }

  checkAndAdd(email, tournamentId) {
    const key = `${email}-${tournamentId}`;
    if (this.customerMap.has(key)) {
      return true; // Duplicate found
    }
    this.customerMap.set(key, { registrationTime: new Date(), status: 'registered' });
    return false; // New registration
  }
}
