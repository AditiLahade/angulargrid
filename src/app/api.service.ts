import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/employee'; 
  // addData: any;

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    console.log('Fetching data from:', this.apiUrl);
    return this.http.get<any>(this.apiUrl);
  }

  updateData(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${data.id}`, data);
  }
  

  deleteData(id: string): Observable<any> {
    const url = `http://localhost:3001/employee/${id}`; 
    return this.http.delete<any>(url);
  }







  addData(data: any): Observable<any> {
    console.log('Sending POST request with data:', data);
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap((response) => console.log('Response from POST request:', response))
    );
  }



}


