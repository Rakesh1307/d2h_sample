import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

class RouterStub {
  url = '';
  navigate = (arg) => {};
}

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let router: RouterStub;
  const routerStub = new RouterStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerStub }]
    });
    service = TestBed.inject(AuthenticationService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expect to return matching number on logging in', () => {
    expect(service.login('aaa', 'aaa')).toEqual(1);
    expect(service.login('aaa', '123')).toEqual(2);
    expect(service.login('abc', 'aaa')).toEqual(3);
  });

  it('should expect router to navigate to home url when called logout',() => {
    spyOn(router, 'navigate').and.callThrough();
    spyOn(localStorage, 'clear');
    service.logout();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
