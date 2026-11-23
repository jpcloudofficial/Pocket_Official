export class LocalStorageDataSource {
  read(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
