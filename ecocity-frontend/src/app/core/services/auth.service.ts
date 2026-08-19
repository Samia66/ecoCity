import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthTokens,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from '../../features/auth/models/auth.model';
import { ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../api/api-response.model';
import { unwrap } from '../api/unwrap-response.operator';
import { TokenService } from './token.service';
import { AuthStore } from '../store/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private authStore = inject(AuthStore);
  private baseUrl = environment.apiUrl;

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}${ENDPOINTS.auth.login}`, payload).pipe(
      unwrap(),
      tap((res) => this.persistSession(res)),
    );
  }

  register(payload: RegisterPayload): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}${ENDPOINTS.auth.register}`, payload).pipe(
      unwrap(),
      tap((res) => this.persistSession(res)),
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<ApiResponse<AuthTokens>>(`${this.baseUrl}${ENDPOINTS.auth.refresh}`, { refreshToken }).pipe(
      unwrap(),
      tap((tokens) => this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken)),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${ENDPOINTS.auth.logout}`, {});
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<{ message: string }> {
    return this.http
      .post<ApiResponse<{ message: string }>>(`${this.baseUrl}${ENDPOINTS.auth.forgotPassword}`, payload)
      .pipe(unwrap());
  }

  resetPassword(payload: ResetPasswordPayload): Observable<{ message: string }> {
    return this.http
      .post<ApiResponse<{ message: string }>>(`${this.baseUrl}${ENDPOINTS.auth.resetPassword}`, payload)
      .pipe(unwrap());
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http
      .post<ApiResponse<{ message: string }>>(`${this.baseUrl}${ENDPOINTS.auth.verifyEmail}`, { token })
      .pipe(unwrap());
  }

  getProfile(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.baseUrl}${ENDPOINTS.auth.profile}`).pipe(
      unwrap(),
      tap((user) => this.authStore.updateUser(user)),
    );
  }

  localLogout(): void {
    this.tokenService.clear();
    this.authStore.clearSession();
  }

  private persistSession(res: LoginResponse): void {
    this.tokenService.setTokens(res.accessToken, res.refreshToken);
    this.tokenService.setCurrentUser(res.user);
    this.authStore.setSession(res.user);
  }
}

