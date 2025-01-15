import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:4000/predict-a-patient';

  constructor(private http: HttpClient) {}

  submitPatientData(patientDetails: any, fundusImage: File): Observable<any> {
    const formData = new FormData();
    formData.append('first_name', patientDetails.first_name);
    formData.append('last_name', patientDetails.last_name);
    formData.append('email', patientDetails.email);
    formData.append('phone', patientDetails.phone);
    formData.append('address', patientDetails.address);
    formData.append('fundusImage', fundusImage);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
