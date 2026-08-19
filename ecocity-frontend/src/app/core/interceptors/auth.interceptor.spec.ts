import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenService } from '../services/token.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    tokenService = jasmine.createSpyObj<TokenService>('TokenService', ['getAccessToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds a Bearer Authorization header when an access token is present', () => {
    tokenService.getAccessToken.and.returnValue('my-access-token');

    httpClient.get('/api/v1/reports').subscribe();

    const req = httpMock.expectOne('/api/v1/reports');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-access-token');
    req.flush({});
  });

  it('does not set an Authorization header when there is no access token', () => {
    tokenService.getAccessToken.and.returnValue(null);

    httpClient.get('/api/v1/reports').subscribe();

    const req = httpMock.expectOne('/api/v1/reports');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('never attaches the access token to the refresh-token request itself', () => {
    tokenService.getAccessToken.and.returnValue('my-access-token');

    httpClient.post('/api/v1/auth/refresh', {}).subscribe();

    const req = httpMock.expectOne('/api/v1/auth/refresh');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
