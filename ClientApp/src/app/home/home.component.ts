import { NotificationMiddlewareService } from './../core/notification-middleware.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    private notificationMiddleware: NotificationMiddlewareService
  ) {}
}
