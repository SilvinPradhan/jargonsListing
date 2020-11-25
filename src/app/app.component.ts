import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { ApiService } from './api.service';
import { Item } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'pwademo';

  items: Array<Item> = [];

  update: boolean = false;

  constructor(
    private apiService: ApiService,
    private updates: SwUpdate,
    private appRef: ApplicationRef
  ) {
    updates.available.subscribe((event) => {
      // this.update = true;
      if (confirm('Update Available for your application. Please Confirm!')) {
        this.updates.activateUpdate().then(() => location.reload());
      }
    });

    updates.activated.subscribe((event) => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    this.checkUpdate();
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.fetch().subscribe(
      (data: Array<Item>) => {
        console.log(data);
        this.items = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(200000);

        timeInterval.subscribe(() => {
          this.updates.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked');
        });
      }
    });
  }
}
