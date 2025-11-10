import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf],
  template: `
    <div style="padding:24px">
      <h1>User App (Angular)</h1>

      <div *ngIf="fromAdmin"
           style="padding:8px 12px; border:1px solid #999; display:inline-block; margin-bottom:12px;">
        Opened from <strong>Admin</strong>
      </div>

      <p *ngIf="!user">No active session.</p>

      <p *ngIf="user">
        Welcome, <strong>{{ user.name }}</strong>
        <span *ngIf="user.role"> (role: {{ user.role }})</span>
      </p>

      <button (click)="goHome()">Go Back to Home</button>
    </div>
  `
})
export class AppComponent implements OnInit {
  user: any = null;
  fromAdmin = false;

  async ngOnInit() {
    this.fromAdmin =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('from') === 'admin';

    const res = await fetch('http://localhost:5000/me', { credentials: 'include' });
    if (res.ok) this.user = await res.json();
  }

  goHome() {
    window.location.href = 'http://localhost:3000';
  }
}