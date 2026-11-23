export class PocketDataRepository {
  constructor(storage) {
    this.storage = storage;
  }

  getData(key) {
    return this.storage.read(key);
  }

  saveData(key, data) {
    return this.storage.write(key, data);
  }
}
