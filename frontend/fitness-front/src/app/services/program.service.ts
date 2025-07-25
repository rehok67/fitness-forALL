import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Program, ProgramSearchParams, CreateProgramRequest } from '../models/program.model';

// Service = Veri getirme işlemlerinin yapıldığı yer
@Injectable({
  providedIn: 'root'  // Bu service tüm uygulamada tek instance olur
})
export class ProgramService {
  
  // Backend URL'si (daha sonra environment'a taşınacak)
  private readonly API_URL = 'http://localhost:8080/api/programs';

  // HttpClient'ı service'e enjekte et
  constructor(private http: HttpClient) { 
    console.log('🏗️ ProgramService oluşturuldu');
  }

  // Tüm programları getir - Artık typed!
  getAllPrograms(): Observable<Program[]> {
    console.log('📡 API çağrısı yapılıyor:', this.API_URL);
    return this.http.get<Program[]>(this.API_URL);
  }

  // ID'ye göre program getir
  getProgramById(id: number): Observable<Program> {
    const url = `${this.API_URL}/${id}`;
    console.log('📡 Program detay API çağrısı:', url);
    return this.http.get<Program>(url);
  }

  // Filtreleme ile program ara
  searchPrograms(params: ProgramSearchParams): Observable<Program[]> {
    let httpParams = new HttpParams();
    
    if (params.equipment) {
      httpParams = httpParams.set('equipment', params.equipment);
    }
    if (params.level) {
      httpParams = httpParams.set('level', params.level);
    }
    if (params.goal) {
      httpParams = httpParams.set('goal', params.goal);
    }
    if (params.maxDuration) {
      httpParams = httpParams.set('maxDuration', params.maxDuration.toString());
    }

    const url = `${this.API_URL}/search`;
    console.log('🔍 Search API çağrısı:', url, 'Params:', params);
    return this.http.get<Program[]>(url, { params: httpParams });
  }

  // Yeni program oluştur - YENİ!
  createProgram(programData: CreateProgramRequest): Observable<Program> {
    console.log('📝 Create Program API çağrısı:', this.API_URL, 'Data:', programData);
    return this.http.post<Program>(this.API_URL, programData);
  }

  // Program güncelle - YENİ!
  updateProgram(id: number, programData: CreateProgramRequest): Observable<Program> {
    const url = `${this.API_URL}/${id}`;
    console.log('✏️ Update Program API çağrısı:', url, 'Data:', programData);
    return this.http.put<Program>(url, programData);
  }

  // Program sil - YENİ!
  deleteProgram(id: number): Observable<void> {
    const url = `${this.API_URL}/${id}`;
    console.log('🗑️ Delete Program API çağrısı:', url);
    return this.http.delete<void>(url);
  }
} 