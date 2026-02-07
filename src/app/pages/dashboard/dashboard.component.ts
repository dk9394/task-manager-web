import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { AuthActions } from '../../features/auth/store/auth.actions';
import { selectUser } from '../../features/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../models/auth/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [UiButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  currentUser = signal<User | null>(null);

  ngOnInit(): void {
    this.currentUser.set(this.authService.getStoredUser());
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
