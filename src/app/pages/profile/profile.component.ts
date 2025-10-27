import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { MatDividerModule } from '@angular/material/divider'; 
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'; 
import { Router, RouterModule } from '@angular/router'; 

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
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  changePasswordForm!: FormGroup;
  isChangingPassword: boolean = false;
  username: string | undefined;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService, 
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Kullanıcı adını token'dan alalım
    this.username = this.authService.decodeToken()?.username;

    // Formu oluştur
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Şifre değiştirme işlemi
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
      error: (err) => {
        const message = err.error?.message || 'Şifre değiştirme başarısız oldu.';
        this.snackBar.open(message, 'Kapat', { duration: 5000 });
        this.isChangingPassword = false;
      },
      complete: () => {
        this.isChangingPassword = false;
      }
    });
  }
  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
}
}