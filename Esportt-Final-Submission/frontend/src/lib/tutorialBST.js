// esportt/lib/tutorialBST.js

export class TutorialBST {
  constructor() {
    this.root = null;
  }

  insert(tutorial) {
    this.root = this._insertNode(this.root, tutorial);
  }

  _insertNode(node, tutorial) {
    if (node === null) {
      return { tutorial, left: null, right: null };
    }
    if (tutorial.skillLevel < node.tutorial.skillLevel) {
      node.left = this._insertNode(node.left, tutorial);
    } else {
      node.right = this._insertNode(node.right, tutorial);
    }
    return node;
  }

  findTutorialsInRange(minSkill, maxSkill) {
    const results = [];
    this._searchRange(this.root, minSkill, maxSkill, results);
    return results;
  }

  _searchRange(node, min, max, results) {
    if (node === null) return;
    const skill = node.tutorial.skillLevel;
    if (skill >= min && skill <= max) {
      results.push(node.tutorial);
    }
    if (skill > min) {
      this._searchRange(node.left, min, max, results);
    }
    if (skill < max) {
      this._searchRange(node.right, min, max, results);
    }
  }
}
