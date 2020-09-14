import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from '../helpers/authentication.service';
import { LoginComponent } from './login.component';

class AuthenticationServiceStub {
  login = () => 1;
  logout = () => { };
}

class RouterStub {
  url = '';
  navigate = (arg) => {};
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: RouterStub;
  const routerStub = new RouterStub();

  let authenticationService: AuthenticationService;
  const authenticationServiceStub = new AuthenticationServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthenticationService, useValue: authenticationServiceStub }]
    })
    .compileComponents();

    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard if username and password matches', () => {
    spyOn(router, 'navigate').and.callThrough();
    spyOn(authenticationService, 'login').and.returnValue(1);
    component.login('abc', 'abc');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should alert with Incorrect Password if password is wrong', () => {
    let alertMessage = 'Default Message';
    spyOn(window, 'alert').and.callFake((msg) => {
      alertMessage = msg;
    });
    spyOn(authenticationService, 'login').and.returnValue(2);
    component.login('abc', '123');
    expect(alertMessage).toEqual('Incorrect Password');
  });

  it('should alert with Enter Valid Name if username is wrong', () => {
    let alertMessage = 'Default Message';
    spyOn(window, 'alert').and.callFake((msg) => {
      alertMessage = msg;
    });
    spyOn(authenticationService, 'login').and.returnValue(3);
    component.login('abc11', '123');
    expect(alertMessage).toEqual('Please enter a valid Username');
  });
});
