import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminServiceService } from './app/Services/admin-service.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminServiceService);
  const router = inject(Router);

  if (adminService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/adminLogin']); // Redirect to login if not authenticated
    return false;
  }
};
