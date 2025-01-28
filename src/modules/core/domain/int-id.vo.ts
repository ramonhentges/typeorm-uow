export class IntId {
  private id: number;
  constructor(id: number) {
    this.isValid(id);
    this.id = id;
  }

  value() {
    return this.id;
  }

  isValid(id: number) {
    if (typeof id !== 'number') {
      throw new Error('Id must be a number');
    }
    if (Number.isNaN(id)) {
      throw new Error('Id must be a valid number');
    }
    if (id < 0) {
      throw new Error('Id must be a positive value');
    }
  }
}
