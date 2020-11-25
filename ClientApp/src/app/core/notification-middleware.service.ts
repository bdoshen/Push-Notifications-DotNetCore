import { NotificationModel } from './../models/notification.model';
import { PushSubscription } from './../models/push-subscription.model';
import { NotificationService } from './../services/notification.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationMiddlewareService {
  public pushNotificationStatus = {
    isSubscribed: false,
    isSupported: false,
    isInProgress: false
  };

  swRegistration = null;

  constructor(
    private notificationService: NotificationService
  ) { }

  init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/assets/sw.js')
        .then(swReg => {
          console.log('Service Worker is registered', swReg);

          this.swRegistration = swReg;
          this.checkSubscription();
        })
        .catch(error => {
          console.error('Service Worker Error', error);
        });
      this.pushNotificationStatus.isSupported = true;
    } else {
      this.pushNotificationStatus.isSupported = false;
    }
  }

  checkSubscription() {
    this.swRegistration.pushManager.getSubscription()
      .then(subscription => {
        console.log(subscription);
        console.log(JSON.stringify(subscription));
        this.pushNotificationStatus.isSubscribed = !(subscription === null);
      });
  }

  subscribe() {
    this.pushNotificationStatus.isInProgress = true;

    const applicationServerKey = this.urlB64ToUint8Array(environment.applicationServerPublicKey);
    this.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
      .then(subscription => {
        console.log(JSON.parse(JSON.stringify(subscription)));
        const jsonSub = JSON.parse(JSON.stringify(subscription));

        this.notificationService.subscribe(<PushSubscription>{
          auth: jsonSub.keys.auth,
          p256dh: jsonSub.keys.p256dh,
          endpoint: jsonSub.endpoint
        }).subscribe(s => {
          console.log('Subscribe came back from C#', s);
          this.pushNotificationStatus.isSubscribed = true;
        });
      })
      .catch(err => {
        console.log('Failed to subscribe the user: ', err);
      })
      .then(() => {
        this.pushNotificationStatus.isInProgress = false;
      });
  }

  unsubscribe() {
    this.pushNotificationStatus.isInProgress = true;
    let jsonSub;
    this.swRegistration.pushManager.getSubscription()
      .then(function (subscription) {
        if (subscription) {
          jsonSub = JSON.parse(JSON.stringify(subscription));
          return subscription.unsubscribe();
        }
      })
      .catch(function (error) {
        console.log('Error unsubscribing', error);
      })
      .then(() => {
        this.notificationService.unsubscribe(<PushSubscription>{
          auth: jsonSub.keys.auth,
          p256dh: jsonSub.keys.p256dh,
          endpoint: jsonSub.endpoint
        }).subscribe(() => {
          this.pushNotificationStatus.isSubscribed = false;
          this.pushNotificationStatus.isInProgress = false;
        });
      });
  }

  toggleSubscription() {
    if (this.pushNotificationStatus.isSubscribed) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  broadcast() {
    const notification = <NotificationModel>{
      title: 'Testing Native Notfications',
      message: 'HURRY CHECK OUT THE LATEST NOTE!!!',
      url: '/counter'
    }

    this.notificationService.broadcast(notification).subscribe(() => {
      console.log('DID THE MESSAGE SEND?!?!?');
    })
  }
}
