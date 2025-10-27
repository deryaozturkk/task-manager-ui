import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.service'; 
import { environment } from '../../environments/environment.prod';

// Backend'deki Task entity'mizin Angular tarafındaki karşılığı
// 'TaskStatus' enum'unu da buraya kopyalıyoruz
export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user?: User;
}

@Injectable({
  providedIn: 'root' 
})
export class TaskService {
  // NestJS API'mizin adresini buraya yazıyoruz
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { } // HttpClient'ı enjekte ediyoruz

  // Tüm görevleri getir (GET /tasks)
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Yeni görev ekle (POST /tasks)
  addTask(task: { title: string; description: string; userId: string }): Observable<Task> { 
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Görevi sil (DELETE /tasks/:id)
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Görevi güncelle (PATCH /tasks/:id)
  // Sadece status'ü veya diğer alanları güncelleyebiliriz
  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, updates);
  }
}