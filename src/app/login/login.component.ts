import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../helpers/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private authenticateService: AuthenticationService) { }

  /**
   * @description used for logging into website
   * @param {string} username username entered by user
   * @param {string} password password entered by user
   */
  login(username: string, password: string) {
    const loginKeyNumber = this.authenticateService.login(username, password);
    if (loginKeyNumber === 1) {
      this.router.navigate(['/dashboard']);
    } else if (loginKeyNumber === 2) {
      this.password = '';
      alert('Incorrect Password');
    } else if (loginKeyNumber === 3) {
      this.password = '';
      alert('Please enter a valid Username');
    }
  }
}
