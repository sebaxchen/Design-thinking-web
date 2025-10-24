import { Component, signal, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { TeamMember } from '../../../application/team.service';

@Component({
  selector: 'app-add-member-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatInput,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption
  ],
  templateUrl: './add-member-modal.html',
  styleUrl: './add-member-modal.css'
})
export class AddMemberModal {
  name = signal('');
  email = signal('');
  role = signal('Miembro');
  isLoading = signal(false);
  errorMessage = signal('');

  roles = [
    { value: 'Admin', label: 'Administrador' },
    { value: 'Manager', label: 'Gerente' },
    { value: 'Miembro', label: 'Miembro' },
    { value: 'Colaborador', label: 'Colaborador' }
  ];

  constructor(private dialogRef: MatDialogRef<AddMemberModal>) {}

  async onAddMember() {
    if (!this.name() || !this.email() || !this.role()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (!this.isValidEmail(this.email())) {
      this.errorMessage.set('Por favor ingresa un email válido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: this.name(),
        email: this.email(),
        role: this.role(),
        avatar: this.getInitials(this.name())
      };

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.dialogRef.close(newMember);
    } catch (error) {
      this.errorMessage.set('Error al agregar el miembro');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
