import { NotificationModel } from './../models/notification.model';
import { PushSubscription } from './../models/push-subscription.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  subscribe(subscription?: PushSubscription) {
    const body = JSON.stringify(subscription);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(environment.apiURL + '/api/Notification/subscribe', body, options);
  }

  broadcast(message: NotificationModel) {
    const body = JSON.stringify(message);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(environment.apiURL + '/api/Notification/broadcast', body, options);
  }

  unsubscribe(subscription?: PushSubscription) {
    const body = JSON.stringify(subscription);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(environment.apiURL + '/api/Notification/unsubscribe', body, options);
  }
}
