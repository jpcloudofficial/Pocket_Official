import { PocketDataRepository as Contract } from '../../domain/repositories/pocket-data-repository.js';
import { STORAGE_KEYS } from '../../core/constants/storage.js';

export class PocketDataRepositoryImpl extends Contract {
  load() {
    return this.getData(STORAGE_KEYS.data);
  }

  save(data) {
    return this.saveData(STORAGE_KEYS.data, data);
  }
}
