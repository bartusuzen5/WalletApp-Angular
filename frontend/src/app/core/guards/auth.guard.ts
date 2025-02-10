import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  

  const token = localStorage.getItem('token');
  if(!token){
    const router: Router = new Router()
    router.navigate(['/login'])
    return false
  } else{
    return true
  }
};
