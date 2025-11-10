import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf],
  template: `
    <div style="padding:24px">
      <h1>Admin App (Angular)</h1>

      <div *ngIf="!logged">
        <button (click)="login()">Admin Login</button>
      </div>

      <div *ngIf="logged">
        <h3>User Applications</h3>
        <ul>
          <li>
            <button (click)="openUserApp()">Open User Application #1</button>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class AppComponent {
  logged = false;

  async login() {
    const res = await fetch('http://localhost:5000/admin/login', {
      method: 'POST',
      credentials: 'include'
    });

    if (res.ok) {
      this.logged = true;
    } else {
      alert('Admin login failed');
    }
  }

  openUserApp() {
    window.location.href = 'http://localhost:4200?from=admin';
  }
}
