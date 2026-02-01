import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UiToastComponent } from './shared/ui/ui-toast/ui-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'task-manager-web';
}
