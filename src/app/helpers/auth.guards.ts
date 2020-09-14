import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
  ) { }

  /**
   * @description checks whether a user is logged in or not
   * @returns true if loggedIn, else false
   */
  canActivate() {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
