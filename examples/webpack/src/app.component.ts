import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'my-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <a [routerLink]="['']">Home</a>
        <router-outlet></router-outlet>
  `,
})
export class AppComponent {
    constructor() {
    }
}