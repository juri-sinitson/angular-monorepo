import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';

describe('ApiPrefixInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should append the api prefix to the request URL', () => {
    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const httpRequest = httpMock.expectOne('api/test');
    expect(httpRequest.request.url).toBe('api/test');
    httpRequest.flush({}); // Respond with a mock response
  });
  
});


