import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router) { }

  /**
   * @description used for authenticate whether the username and passowrd matches.
   *  Checking only for single user 'aaa' for demo purpose
   * @param {string} username username entered by user
   * @param {string} password password entered by user
   * @returns {number} if matches returns 1 else 2 for incorrect password or 3 for invalid user
   */
  login(username: string, password: string): number {
    if (username === 'aaa') {
      if (password === 'aaa') {
        localStorage.setItem('currentUser', username);
        return 1;
      } else {
        return 2;
      }
    } else {
      return 3;
    }
  }

  /**
   * @description used to logout from apllication
   *  Redirects you to dasboard page
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
