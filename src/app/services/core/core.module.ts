import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseModule } from './firebase/firebase.module';
import { environment } from 'src/environments/environment';
import { ENV_CONFIG } from './env';

@NgModule({
  declarations: [],
  providers: [{ provide: ENV_CONFIG, useValue: environment }],
  imports: [FirebaseModule, CommonModule],
})
export class CoreModule {}
