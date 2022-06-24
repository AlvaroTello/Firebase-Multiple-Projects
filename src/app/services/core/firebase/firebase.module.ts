import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { ENV, ENV_CONFIG } from '../env';
import { InjectionToken, NgModule, NgZone, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppCheckInstances } from '@angular/fire/app-check';

export const FIREBASE_PROJECT_ONE = new InjectionToken(
  'firebase project injection'
);
export const FIREBASE_PROJECT_TWO = new InjectionToken(
  'firebase project injection'
);

export function AngularFirestoreFactory(
  platformId: any,
  zone: NgZone,
  env: ENV,
  projectId: string,
  schedules: any,
  auth: AngularFireAuth,
  appCheckInstances: AppCheckInstances
) {
  return new AngularFirestore(
    env.firebaseConfig[projectId],
    projectId,
    false,
    null,
    platformId,
    zone,
    schedules,
    null,
    null,
    auth,
    null,
    null,
    null,
    null,
    null,
    null,
    appCheckInstances
  );
}

export const FIREBASE_REFERENCES = {
  ONE_FIRESTORE: 'projectOne',
  TWO_FIRESTORE: 'projectTwo',
};

@NgModule({
  declarations: [],
  providers: [
    { provide: FIREBASE_PROJECT_ONE, useValue: 'projectOne' },
    { provide: FIREBASE_PROJECT_TWO, useValue: 'projectTwo' },
    {
      provide: FIREBASE_REFERENCES.ONE_FIRESTORE,
      deps: [PLATFORM_ID, NgZone, ENV_CONFIG, FIREBASE_PROJECT_ONE],
      useFactory: AngularFirestoreFactory,
    },
    {
      provide: FIREBASE_REFERENCES.TWO_FIRESTORE,
      deps: [PLATFORM_ID, NgZone, ENV_CONFIG, FIREBASE_PROJECT_TWO],
      useFactory: AngularFirestoreFactory,
    },
  ],
  imports: [CommonModule],
})
export class FirebaseModule {}
