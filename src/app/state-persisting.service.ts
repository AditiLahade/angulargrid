import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatePersistingService {
  public set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}