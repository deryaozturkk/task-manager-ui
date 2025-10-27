import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; 
// Token'ın içindeki verinin yapısını (payload) tanımlayalım
interface JwtPayload {
  username: string;
  sub: string; // User ID
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) { }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: any): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  changePassword(passwords: any): Observable<void> {
    // Backend'de PATCH metodunu kullandık
    return this.http.patch<void>(`${this.apiUrl}/password`, passwords);
  }
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token);
      } catch (error) {
        console.error("Invalid token:", error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  getUserRole(): 'admin' | 'user' | null {
    const payload = this.decodeToken();
    return payload ? payload.role : null;
  }

  getUserId(): string | null {
    const payload = this.decodeToken();
    return payload ? payload.sub : null;
  }
  
  isLoggedIn(): boolean {
    const payload = this.decodeToken();
    if (payload && payload.exp) {
      const isExpired = Date.now() >= payload.exp * 1000;
      if (isExpired) {
        this.logout();
        return false;
      }
      return true;
    }
    return false;
  }
}