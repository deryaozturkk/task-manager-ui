import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task, TaskService, TaskStatus } from '../../services/task.service';
import { AuthService } from '../../services/auth.service'; 
import { User, UserService } from '../../services/user.service'; 
import { Router } from '@angular/router'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select'; 
import { RouterModule } from '@angular/router'; 
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatSelectModule,
    RouterModule, 
    MatTabsModule, 
    MatDialogModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  // --- Değişkenler ---
  public allTasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public TaskStatus = TaskStatus;

  public isLoadingList = false;
  public isAddingTask = false;
  public tasksBeingModified = new Set<string>();

  public filterControl = new FormControl('ALL');

  public userRole: 'admin' | 'user' | null = null;
  public usersForAssignment: User[] = [];

  public addTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    userId: new FormControl<string | null>(null, [Validators.required]), // Admin için zorunlu olacak
  });

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public authService: AuthService, 
    private userService: UserService, 
    private router: Router, 
    private dialog: MatDialog,
  ) {}

  // --- Yaşam Döngüsü (Lifecycle) ---
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();

    if (this.userRole === 'user') {
      this.addTaskForm.get('userId')?.disable();
      // Opsiyonel: User'ın görev eklemesini tamamen engellemek istersem:
      //this.addTaskForm.disable(); // Bu satırı açabilirim
    } else if (this.userRole === 'admin') {
      this.loadUsersForAssignment();
    }

    this.loadTasks(); // Görevleri yükle

    this.filterControl.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  // --- API Fonksiyonları ---

  loadUsersForAssignment(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.usersForAssignment = users;
      },
      error: (err) => {
        this.showError('Kullanıcı listesi yüklenemedi!');
      }
    });
  }

  loadTasks(): void {
    this.isLoadingList = true;
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.allTasks = data;
        this.applyFilter();
        this.isLoadingList = false;
      },
      error: (err) => {
        if (err.status === 403) {
          this.showError('Görevleri görme yetkiniz yok.');
        } else {
          this.showError('Görevler yüklenemedi!');
        }
        this.isLoadingList = false;
      },
    });
  }

  onAddTask(): void {
    if (this.addTaskForm.invalid) {
      return;
    }
    this.isAddingTask = true;

    const title = this.addTaskForm.value.title ?? '';
    const description = this.addTaskForm.value.description ?? '';
    
    // Eğer user ise, kendi ID'sini al; admin ise formdan seçileni al
    const userId = this.userRole === 'user'
                    ? this.authService.getUserId()
                    : this.addTaskForm.value.userId;

    // userId null ise (beklenmedik bir durum), işlemi durdur
    if (!userId) {
      this.showError('Kullanıcı ID\'si bulunamadı!');
      this.isAddingTask = false;
      return;
    }

    this.taskService.addTask({ title, description, userId }).subscribe({
      next: (newTask) => {
        // Yeni eklenen görevin kullanıcı bilgisini manuel ekleyebiliriz (opsiyonel)
        if (this.userRole === 'admin') {
            const assignedUser = this.usersForAssignment.find(u => u.id === userId);
            if (assignedUser) newTask.user = assignedUser; // Frontend'de anında göstermek için
        } else {
             // User kendine ekledi, user bilgisini ekle (opsiyonel)
             newTask.user = { id: userId, username: 'Kendiniz', role: 'user' };
        }

        this.allTasks.push(newTask);
        this.applyFilter();
        this.addTaskForm.reset();
        this.showError('Görev eklendi!', 'success');
        this.isAddingTask = false;
      },
      error: (err) => {
        if (err.status === 403) {
          this.showError('Görev ekleme yetkiniz yok.');
        } else {
          this.showError('Görev eklenemedi!');
        }
        this.isAddingTask = false;
      },
    });
  }

  onDeleteTask(taskId: string): void {
    // 1. Dialog penceresini aç
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Görevi Sil',
        message: 'Bu görevi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
        confirmText: 'Evet, Sil',
        cancelText: 'İptal'
      }
    });
  
    // 2. Dialog kapandığında sonucu dinle (subscribe)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksBeingModified.add(taskId);
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.snackBar.open('Görev başarıyla silindi.', 'Kapat', { duration: 3000 });
            this.loadTasks(); 
          },
          error: (err) => {
            const message = err.error?.message || 'Görev silinirken bir hata oluştu.';
            this.snackBar.open(message, 'Kapat', { duration: 5000 });
            this.tasksBeingModified.delete(taskId);
          },
          complete: () => {
            this.tasksBeingModified.delete(taskId);
          }
        });
      }
    });
  }

  onToggleTaskStatus(task: Task): void {

    this.tasksBeingModified.add(task.id);
    const newStatus =
      task.status === TaskStatus.PENDING
        ? TaskStatus.COMPLETED
        : TaskStatus.PENDING;

    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (updatedTask) => {
         const taskIndex = this.allTasks.findIndex(t => t.id === task.id);
         if (taskIndex > -1) {
             this.allTasks[taskIndex] = { ...this.allTasks[taskIndex], status: updatedTask.status };
         }
        this.applyFilter();
        this.tasksBeingModified.delete(task.id);
      },
      error: (err) => {
         if (err.status === 403) this.showError('Görev güncelleme yetkiniz yok.');
         else this.showError('Görev güncellenemedi!');
        this.tasksBeingModified.delete(task.id);
      },
    });
  }

  // --- Yardımcı Fonksiyonlar ---
  applyFilter(): void {
    const filter = this.filterControl.value;
    if (filter === 'PENDING') {
      this.filteredTasks = this.allTasks.filter(
        (t) => t.status === TaskStatus.PENDING,
      );
    } else if (filter === 'COMPLETED') {
      this.filteredTasks = this.allTasks.filter(
        (t) => t.status === TaskStatus.COMPLETED,
      );
    } else {
      this.filteredTasks = [...this.allTasks]; // 'ALL' - Kopyasını oluşturmak daha güvenli
    }
  }

  showError(message: string, panelClass: 'error' | 'success' | 'info' = 'error'): void {
    this.snackBar.open(message, 'Kapat', {
      duration: 3000,
      panelClass: [panelClass],
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

