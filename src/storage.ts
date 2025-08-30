export class Storage {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getNumber(key: string, defaultValue = 0): number {
    const value = this.get(key);
    return value ? parseInt(value, 10) : defaultValue;
  }

  setNumber(key: string, value: number): void {
    this.set(key, value.toString());
  }

  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.get(key);
    return value ? value === 'true' : defaultValue;
  }

  setBoolean(key: string, value: boolean): void {
    this.set(key, value.toString());
  }
}
