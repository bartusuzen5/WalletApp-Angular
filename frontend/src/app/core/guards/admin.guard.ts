import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  
  const _auth = inject(AuthService)
  const router = new Router()

  const role = _auth.getUserRole()
  if (role === 'admin'){
    return true
  } else {
    router.navigate(['/'])
    return false
  }
};