import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
  // Kullanıcı Rolünü Güncelleme
  updateUserRole(userId: string, role: 'admin' | 'user'): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/role`, { role });
  }
  
}