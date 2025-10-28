// src/app/pages/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service'; // ../../ düzeltildi
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { User, UserService } from '../../services/user.service'; // ../../ düzeltildi

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatListModule,
    MatSelectModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  changePasswordForm!: FormGroup;
  isChangingPassword: boolean = false;
  username: string | undefined;
  userRole: 'admin' | 'user' | null = null;
  loggedInUserId: string | null = null;

  users: User[] = [];
  isLoadingUsers = false;
  updatingRoleId: string | null = null;

  // Bekleyen rol değişikliklerini tutacak nesne
  pendingRoleChanges: { [userId: string]: 'admin' | 'user' } = {};

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService, // private olarak düzeltildi
  ) {}

  ngOnInit(): void {
    const decodedToken = this.authService.decodeToken();
    this.username = decodedToken?.username;
    this.userRole = this.authService.getUserRole();
    this.loggedInUserId = this.authService.getUserId();

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.userRole === 'admin') {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (data: User[]) => { // Tip eklendi
        this.users = data;
        this.isLoadingUsers = false;
      },
      error: (err: any) => { // Tip eklendi
        this.snackBar.open('Kullanıcı listesi yüklenemedi!', 'Kapat', { duration: 3000 });
        this.isLoadingUsers = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.snackBar.open('Lütfen formu doğru doldurunuz.', 'Kapat', { duration: 3000 });
      return;
    }

    this.isChangingPassword = true;
    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.snackBar.open('Şifre başarıyla güncellendi. Güvenliğiniz için tekrar giriş yapınız.', 'Kapat', { duration: 5000 });
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err: any) => { // Tip eklendi
        const message = err.error?.message || 'Şifre değiştirme başarısız oldu.';
        this.snackBar.open(message, 'Kapat', { duration: 5000 });
        this.isChangingPassword = false;
      },
      complete: () => {
        this.isChangingPassword = false;
      }
    });
  }

    // Dropdown değiştiğinde çağrılır, sadece bekleyen değişikliği kaydeder
    onRoleSelectionChange(userId: string, newRole: 'admin' | 'user'): void {
      this.pendingRoleChanges[userId] = newRole;
    }

    // 'Kaydet' butonuna basıldığında çağrılır
    onSaveUserRole(userId: string, newRole: 'admin' | 'user'): void {
      this.updatingRoleId = userId; // Spinner'ı başlat
      this.userService.updateUserRole(userId, newRole).subscribe({
        next: (updatedUser: User) => { // Tip eklendi
          // Listedeki kullanıcıyı güncelle
          const index = this.users.findIndex(u => u.id === userId);
          if (index > -1) {
            this.users[index] = updatedUser;
          }
          // Bekleyen değişikliği temizle
          delete this.pendingRoleChanges[userId];
          this.snackBar.open(`${updatedUser.username} rolü ${newRole} olarak güncellendi.`, 'Tamam', { duration: 3000, panelClass: ['success'] });
          this.updatingRoleId = null; // Spinner'ı durdur
        },
        error: (err: any) => { // Tip eklendi
          const message = err.error?.message || 'Rol güncellenemedi.';
          this.snackBar.open(message, 'Kapat', { duration: 5000, panelClass: ['error'] });
          this.updatingRoleId = null; // Spinner'ı durdur
        }
      });
    }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

