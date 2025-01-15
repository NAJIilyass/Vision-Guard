import { Component, ElementRef, ViewChild } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('fundusUpload', { static: false }) fileInput!: ElementRef;

  first_name: string = '';
  last_name: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  fundusImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private patientService: PatientService) {}

  triggerFileUpload(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('File input element not found');
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'File size exceeds 10MB limit.';
        this.fundusImage = null;
        this.previewImage = null;
      } else {
        this.fundusImage = file;
        this.errorMessage = '';

        // Generate preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result !== undefined && e.target?.result !== null) {
            this.previewImage = e.target.result; // Assign only if result is valid
          }
        };
        reader.readAsDataURL(file); // Convert the file to a DataURL
      }
    }
  }

  onSubmit(): void {
    if (!this.fundusImage) {
      this.errorMessage = 'Please upload a valid image.';
      return;
    }

    const patientDetails = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };

    this.patientService.submitPatientData(patientDetails, this.fundusImage).subscribe({
      next: (response) => {
        this.successMessage = 'Prediction completed successfully!';
        this.errorMessage = '';
        console.log('Response:', response);
      },
      error: (error) => {
        this.errorMessage = 'Failed to process the prediction. Please try again.';
        this.successMessage = '';
        console.error('Error:', error);
      },
    });
  }
}
