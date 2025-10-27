import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] 
})
export class RegisterComponent {
  public isLoading = false;
  
  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const credentials = this.registerForm.value;

    this.authService.register(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Kayıt başarılı! Lütfen giriş yapın.', 'Tamam', {
          duration: 3000,
          panelClass: ['success'],
        });
        this.router.navigateByUrl('/login'); 
      },
      error: (err) => {
        this.isLoading = false;
        let errorMessage = 'Kayıt olurken bir hata oluştu.';
        if (err.status === 409) {
          errorMessage = 'Bu kullanıcı adı zaten alınmış.';
        }
        this.snackBar.open(errorMessage, 'Kapat', {
          duration: 3000,
          panelClass: ['error'],
        });
      }
    });
  }
}