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
import { TokenService } from './token.service';
import { AuthStore } from '../store/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private authStore = inject(AuthStore);
  private baseUrl = environment.apiUrl;

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}${ENDPOINTS.auth.login}`, payload).pipe(
      tap((res) => this.persistSession(res)),
    );
  }

  register(payload: RegisterPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}${ENDPOINTS.auth.register}`, payload).pipe(
      tap((res) => this.persistSession(res)),
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthTokens>(`${this.baseUrl}${ENDPOINTS.auth.refresh}`, { refreshToken }).pipe(
      tap((tokens) => this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken)),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${ENDPOINTS.auth.logout}`, {});
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}${ENDPOINTS.auth.forgotPassword}`, payload);
  }

  resetPassword(payload: ResetPasswordPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}${ENDPOINTS.auth.resetPassword}`, payload);
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}${ENDPOINTS.auth.verifyEmail}`, { token });
  }

  getProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}${ENDPOINTS.auth.profile}`).pipe(
      tap((user) => this.authStore.updateUser(user)),
    );
  }

  localLogout(): void {
    this.tokenService.clear();
    this.authStore.clearSession();
  }

  private persistSession(res: any): void {
    const data = res.data ?? res;

    this.tokenService.setTokens(
      data.accessToken,
      data.refreshToken,
    );

    this.tokenService.setCurrentUser(
      data.user,
    );

    this.authStore.setSession(
      data.user,
    );
  }
}
