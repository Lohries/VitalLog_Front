import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AnalyticsResponse } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getAnalytics() {
    return this.http.get<AnalyticsResponse>(`${environment.apiUrl}/analytics`);
  }
}
