import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { Toast } from 'primeng/toast';
import { Auth } from './features/auth/auth';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, FormsModule, InputTextModule, DatePickerModule, Toast, Auth],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('exam-app');
  value: string | undefined;
  date: Date | undefined;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
}
