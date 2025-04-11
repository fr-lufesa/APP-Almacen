import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Network } from '@capacitor/network';


export const networkGuard: CanActivateChildFn = async (childRoute, state) => {
  const router = inject(Router);
  const status = await Network.getStatus();
  
  if (status.connected) {
    return true;
  } else {
    router.navigate(['/no-connection']);
    return false;
  }
};
