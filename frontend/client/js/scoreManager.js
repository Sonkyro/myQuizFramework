export class ScoreManager {
  constructor() {
    this.results = [];
  }

  add(result) {
    this.results.push(result);
  }

  getSummary() {
    const correct = this.results.filter(r => r.correct).length;
    return {
      correct,
      total: this.results.length,
      percent: Math.round(correct / this.results.length * 100)
    };
  }
}
