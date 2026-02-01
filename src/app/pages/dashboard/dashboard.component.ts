import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { AuthActions } from '../../features/auth/store/auth.actions';

@Component({
  selector: 'app-dashboard',
  imports: [UiButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private store = inject(Store);

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
