import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../application/auth.service';
import { TeamService } from '../../../application/team.service';

export interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedDate: Date;
  url?: string;
  sharedWithMembers?: string[];
  sharedWithGroups?: string[];
}

@Component({
  selector: 'app-shared-files',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './shared-files.html',
  styleUrl: './shared-files.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFilesComponent {
  authService = inject(AuthService);
  teamService = inject(TeamService);
  files = signal<SharedFile[]>([]);
  isUploadDialogOpen = signal(false);
  selectedFiles = signal<File[]>([]);
  isUploading = signal(false);
  isShareDialogOpen = signal(false);
  selectedFileId = signal<string | null>(null);
  selectedTeamMembers = signal<string[]>([]);
  selectedGroups = signal<string[]>([]);
  availableMembers = signal<any[]>([]);
  availableGroups = signal<any[]>([]);
  isDragOver = signal(false);

  constructor() {
    this.loadFiles();
    this.loadTeamData();
  }

  loadFiles() {
    const savedFiles = localStorage.getItem('sharedFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
        ...file,
        uploadedDate: new Date(file.uploadedDate)
      }));
      this.files.set(parsedFiles);
    }
  }

  openUploadDialog() {
    this.isUploadDialogOpen.set(true);
  }

  closeUploadDialog() {
    this.isUploadDialogOpen.set(false);
    this.selectedFiles.set([]);
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles.set(files);
  }

  uploadFiles() {
    if (this.selectedFiles().length === 0) return;

    this.isUploading.set(true);

    setTimeout(() => {
      const newFiles: SharedFile[] = this.selectedFiles().map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        uploadedBy: this.authService.getUserName(),
        uploadedDate: new Date(),
        sharedWithMembers: [],
        sharedWithGroups: []
      }));

      this.files.update(current => [...current, ...newFiles]);
      this.saveFiles();
      
      this.isUploading.set(false);
      this.closeUploadDialog();
    }, 1000);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0) {
      this.selectedFiles.set(files);
      this.uploadFiles();
    }
  }

  saveFiles() {
    localStorage.setItem('sharedFiles', JSON.stringify(this.files()));
  }

  deleteFile(fileId: string) {
    this.files.update(current => current.filter(f => f.id !== fileId));
    this.saveFiles();
  }

  downloadFile(file: SharedFile) {
    // Simulate download
    console.log('Downloading file:', file.name);
  }

  openShareDialog(fileId: string) {
    this.selectedFileId.set(fileId);
    this.isShareDialogOpen.set(true);
    const file = this.files().find(f => f.id === fileId);
    if (file) {
      this.selectedTeamMembers.set(file.sharedWithMembers || []);
      this.selectedGroups.set(file.sharedWithGroups || []);
    }
  }

  closeShareDialog() {
    this.isShareDialogOpen.set(false);
    this.selectedFileId.set(null);
    this.selectedTeamMembers.set([]);
    this.selectedGroups.set([]);
  }

  loadTeamData() {
    // Load members from TeamService
    this.availableMembers.set(this.teamService.allMembers());
    
    // Load groups from localStorage
    const groups = localStorage.getItem('groups');
    if (groups) {
      this.availableGroups.set(JSON.parse(groups));
    }
  }

  toggleMember(memberName: string) {
    const members = this.selectedTeamMembers();
    if (members.includes(memberName)) {
      this.selectedTeamMembers.set(members.filter(m => m !== memberName));
    } else {
      this.selectedTeamMembers.set([...members, memberName]);
    }
  }

  toggleGroup(groupName: string) {
    const groups = this.selectedGroups();
    if (groups.includes(groupName)) {
      this.selectedGroups.set(groups.filter(g => g !== groupName));
    } else {
      this.selectedGroups.set([...groups, groupName]);
    }
  }

  saveShareSettings() {
    if (!this.selectedFileId()) return;

    const fileId = this.selectedFileId();
    this.files.update(current =>
      current.map(file =>
        file.id === fileId
          ? {
              ...file,
              sharedWithMembers: this.selectedTeamMembers(),
              sharedWithGroups: this.selectedGroups()
            }
          : file
      )
    );
    this.saveFiles();
    this.closeShareDialog();
  }

  isSharedWith(file: SharedFile, memberName: string): boolean {
    return file.sharedWithMembers?.includes(memberName) || false;
  }

  isSharedWithGroup(file: SharedFile, groupName: string): boolean {
    return file.sharedWithGroups?.includes(groupName) || false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(type: string): string {
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'table_chart';
    if (type.includes('presentation')) return 'slideshow';
    if (type.includes('video')) return 'videocam';
    if (type.includes('audio')) return 'audiotrack';
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return 'archive';
    return 'insert_drive_file';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // Método para obtener el color de un miembro
  getMemberColor(memberName: string): string {
    return this.teamService.getMemberColor(memberName);
  }
}

