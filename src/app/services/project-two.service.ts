import { Inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  QueryDocumentSnapshot,
  FieldPath,
} from '@angular/fire/compat/firestore';
import { WhereFilterOp } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FIREBASE_REFERENCES } from './core/firebase/firebase.module';

@Injectable({
  providedIn: 'root',
})
export class ProjectTwoService {
  constructor(
    @Inject(FIREBASE_REFERENCES.TWO_FIRESTORE)
    private readonly afs: AngularFirestore
  ) {}

  /**
   * Method to get an Observable from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   *
   * @returns `Promise<Observable<any>>`
   *
   */
  getCollectionObservable(path: string): Promise<Observable<any>> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref: AngularFirestoreCollection = this.afs.collection(path);
        const observable = await ref.valueChanges();
        resolve(observable);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Method to get data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   *
   * @returns `Promise<any>`
   *
   */
  async getAllDataFromCollection(path: string): Promise<any> {
    try {
      const snapshot: any = await this.afs.collection(path).get().toPromise();
      const data: any[] = [];
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to update document data in a Firestore collection
   *
   * @param collectionId `string` Collection uid
   * @param uid `string` Document uid
   * @param data `Object` with the document data to update
   *
   * @returns `Promise<any>`
   *
   */
  async updateDocument(
    collectionId: string,
    uid: string,
    data: Object
  ): Promise<any> {
    try {
      await this.afs
        .collection(collectionId)
        .doc(uid)
        .set(data, { merge: true });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to delete a document in a Firestore collection
   *
   * @param collectionId `string` Collection uid
   * @param uid `string` Document uid
   *
   * @returns `Promise<any>`
   *
   */
  async deleteDocument(collectionId: string, uid: string): Promise<any> {
    try {
      await this.afs.collection(collectionId).doc(uid).delete();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to get a document observable from a Firestore collection
   *
   * @param collectionId `string` Collection uid
   * @param uid `string` Document uid
   *
   * @returns `Observable<DocumentSnapshot>`
   *
   */
  getDocumentObservable(collectionId: string, uid: string): Observable<any> {
    return this.afs.collection(collectionId).doc(uid).get();
  }

  /**
   * Method to get a document observable from a Firestore collection
   *
   * @param collectionId `string` Collection uid
   * @param uid `string` Document uid
   *
   * @returns `Promise<Observable<any>`
   *
   */
  async getDocumentObservableAsync(
    collectionId: string,
    uid: string
  ): Promise<Observable<any>> {
    // Sets user data to firestore on login
    try {
      const docObservable: Observable<any> = this.afs
        .collection(collectionId)
        .doc(uid)
        .valueChanges();
      return Promise.resolve(docObservable);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to create a document with data in a Firestore collection
   *
   * @param collectionId `string` Collection uid
   * @param data `Object` with the document data to update
   *
   * @returns `Promise<any>`
   *
   */
  async insertDocument(collectionId: string, data: Object): Promise<any> {
    try {
      const response = await this.afs.collection(collectionId).add(data);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to get data from a Firestore collection
   *
   * @param collectionId `string` Path to the Collection id
   * @param documentUid `string` Uid of the Document
   *
   * @returns `Promise<any>`
   *
   */

  async getAllDataFromDocument(
    collectionId: string,
    documentUid: string
  ): Promise<any> {
    try {
      const documentSnapshot: any = await this.afs
        .collection(collectionId)
        .doc(documentUid)
        .get()
        .toPromise();
      return Promise.resolve(documentSnapshot.data());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkIfDocumentExists(
    collectionId: string,
    documentUid: string
  ): Promise<boolean> {
    try {
      const documentSnapshot: any = await this.afs
        .collection(collectionId)
        .doc(documentUid)
        .get()
        .toPromise();
      if (documentSnapshot.exists) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr 'desc' | 'asc' Direction of orderBy
   * @param limit `number` Number of results in the query
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param secondConditionSign `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param secondValueEvaluated `string` String of the key to be evaluated
   * @param secondCondition `string` String with the value for comparison
   * @returns `Promise<any>`
   *
   */
  async getObservableCompoundQueryFromCollectionWithLimits(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    limit: number,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | boolean | number,
    secondConditionSign: WhereFilterOp,
    secondValueEvaluated: string,
    secondCondition: string | boolean | number
  ): Promise<Observable<DocumentData[]>> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref
          .where(valueEvaluated, conditionSign, condition)
          .where(secondValueEvaluated, secondConditionSign, secondCondition)
          .orderBy(orderKey, directionStr)
          .limit(limit)
      );
      const queryObservable = await collectionRef.valueChanges();
      return Promise.resolve(queryObservable);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection without limit of documents.
   *
   * @param path `string` Path to the Collection id
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @returns `Promise<any>`
   *
   */
  async getQueryFromCollectionWithoutLimits(
    path: string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | boolean | number
  ): Promise<any> {
    try {
      const dataArray: any[] | PromiseLike<any[]> = [];
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref.where(valueEvaluated, conditionSign, condition)
      );
      await collectionRef
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          querySnapshot.forEach(
            (queryDocumentSnapshot: QueryDocumentSnapshot<any>) => {
              dataArray.push(queryDocumentSnapshot.data());
            }
          );
        });
      return Promise.resolve(dataArray);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection without limit of documents.
   *
   * @param path `string` Path to the Collection id
   * @param orderKey
   * @param directionStr
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @returns `Promise<any>`
   *
   */
  async getOrderedQueryFromCollectionWithoutLimits(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | boolean | number
  ): Promise<any> {
    try {
      const dataArray: any[] | PromiseLike<any[]> = [];
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref
          .where(valueEvaluated, conditionSign, condition)
          .orderBy(orderKey, directionStr)
      );
      await collectionRef
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          querySnapshot.forEach(
            (queryDocumentSnapshot: QueryDocumentSnapshot<any>) => {
              dataArray.push(queryDocumentSnapshot.data());
            }
          );
        });
      return Promise.resolve(dataArray);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr
   * @param limit `number` Number of results in the query
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param secondConditionSign `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param secondValueEvaluated `string` String of the key to be evaluated
   * @param secondCondition `string` String with the value for comparison
   * @param thirdConditionSign
   * @param thirdValueEvaluated
   * @param thirdCondition
   * @returns `Promise<any>`
   *
   */
  async getObservableMoreCompoundQueryFromCollectionWithLimits(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    limit: number,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | boolean | number,
    secondConditionSign: WhereFilterOp,
    secondValueEvaluated: string,
    secondCondition: string | boolean | number,
    thirdConditionSign: WhereFilterOp,
    thirdValueEvaluated: string,
    thirdCondition: string | boolean | number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let collectionRef: AngularFirestoreCollection;
        collectionRef = await this.afs.collection(path, (ref) =>
          ref
            .where(valueEvaluated, conditionSign, condition)
            .where(secondValueEvaluated, secondConditionSign, secondCondition)
            .where(thirdValueEvaluated, thirdConditionSign, thirdCondition)
            .orderBy(orderKey, directionStr)
            .limit(limit)
        );
        const queryObservable = await collectionRef.valueChanges();
        resolve(queryObservable);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param secondConditionSign `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param secondValueEvaluated `string` String of the key to be evaluated
   * @param secondCondition `string` String with the value for comparison
   * @returns `Promise<any>`
   *
   */
  async getObservableCompoundQueryFromCollectionWithoutLimits(
    path: string,
    orderKey: string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | Date | number,
    secondConditionSign: WhereFilterOp,
    secondValueEvaluated: string,
    secondCondition: string | Date | number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let collectionRef: AngularFirestoreCollection;
        collectionRef = await this.afs.collection(path, (ref) =>
          ref
            .where(valueEvaluated, conditionSign, condition)
            .where(secondValueEvaluated, secondConditionSign, secondCondition)
            .orderBy(orderKey, 'desc')
        );
        const queryObservable = await collectionRef.valueChanges();
        resolve(queryObservable);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param secondConditionSign `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param secondValueEvaluated `string` String of the key to be evaluated
   * @param secondCondition `string` String with the value for comparison
   * @param thirdConditionSign string` String with the conditional operator (for example: '==', '>=', etc)
   * @param thirdValueEvaluated `string` String of the key to be evaluated
   * @param thirdCondition `string` String with the value for comparison
   * @returns `Promise<any>`
   *
   */
  async getObservableVeryCompoundQueryFromCollectionWithoutLimits(
    path: string,
    orderKey: string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | Date | number,
    secondConditionSign: WhereFilterOp,
    secondValueEvaluated: string,
    secondCondition: string | Date | number,
    thirdConditionSign: WhereFilterOp,
    thirdValueEvaluated: string,
    thirdCondition: string | Date | number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let collectionRef: AngularFirestoreCollection;
        collectionRef = await this.afs.collection(path, (ref) =>
          ref
            .where(valueEvaluated, conditionSign, condition)
            .where(secondValueEvaluated, secondConditionSign, secondCondition)
            .where(thirdValueEvaluated, thirdConditionSign, thirdCondition)
            .orderBy(orderKey, 'desc')
        );
        const queryObservable = await collectionRef.valueChanges();
        resolve(queryObservable);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param initialRange
   * @param finalRange
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param dateKey
   * @returns `Promise<Observable<DocumentData[]>>`
   *
   */
  async getObservableCompoundQueryFromCollectionWithDateRange(
    path: string,
    orderKey: string,
    initialRange: Date | string,
    finalRange: Date | string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string,
    dateKey: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let collectionRef: AngularFirestoreCollection;
        collectionRef = await this.afs.collection(path, (ref) =>
          ref
            .where(valueEvaluated, conditionSign, condition)
            .where(dateKey, '>=', initialRange)
            .where(dateKey, '<', finalRange)
            .orderBy(orderKey, 'desc')
        );
        const queryObservable = await collectionRef.valueChanges();
        resolve(queryObservable);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param limit `number` Number of results in the query
   *
   * @returns `Promise<DocumentData[]>`
   *
   */
  async queryDataFromCollection(
    path: string,
    orderKey: string,
    limit: number
  ): Promise<DocumentData[]> {
    try {
      const data = [];
      const snapshot: any = await this.afs
        .collection(path, (ref) => ref.orderBy(orderKey).limit(limit))
        .get()
        .toPromise();
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr 'desc' | 'asc' Direction of orderBy
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param limit `number` Number of results in the query
   * @returns `Promise<Observable<DocumentData[]>>`
   *
   */
  async getObservableQueryFromCollectionWithLimits(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    conditionSign: WhereFilterOp,
    valueEvaluated: string | FieldPath,
    condition: string | number,
    limit: number
  ): Promise<Observable<DocumentData[]>> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = this.afs.collection(path, (ref) =>
        ref
          .where(valueEvaluated, conditionSign, condition)
          .orderBy(orderKey, directionStr)
          .limit(limit)
      );
      const queryObservable = collectionRef.valueChanges();
      return Promise.resolve(queryObservable);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param limit `number` Number of results in the query
   * @param initialRange
   * @param finalRange
   * @param dateKey
   * @returns `Promise<Observable<DocumentData[]>>`
   *
   */
  async getObservableQueryFromCollectionWithDateRangeWithLimit(
    path: string,
    orderKey: string,
    limit: number,
    initialRange: Date | string,
    finalRange: Date | string,
    dateKey: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let collectionRef: AngularFirestoreCollection;
        collectionRef = await this.afs.collection(path, (ref) =>
          ref
            .where(dateKey, '>=', initialRange)
            .where(dateKey, '<', finalRange)
            .orderBy(orderKey, 'desc')
            .limit(limit)
        );
        const queryObservable = await collectionRef.valueChanges();
        resolve(queryObservable);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param limit `number` Number of results in the query
   * @param initialRange
   * @param directionStr 'desc' | 'asc' Direction of orderBy
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param finalRange
   * @param dateKey
   * @returns `Promise<DocumentData[]>`
   *
   */
  async getDataOnceWithQueryFromCollectionWithDateRangeWithLimit(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    initialRange: Date | string,
    finalRange: Date | string,
    dateKey: string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string | FieldPath,
    condition: string | number,
    limit: number
  ): Promise<DocumentData[]> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref
          .where(dateKey, '>=', initialRange)
          .where(dateKey, '<', finalRange)
          .where(valueEvaluated, conditionSign, condition)
          .orderBy(orderKey, directionStr)
          .limit(limit)
      );
      const snapshot: any = await collectionRef.get().toPromise();
      const data: DocumentData[] = [];
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr 'desc' | 'asc' Direction of orderBy
   * @param limit `number` Number of results in the query
   * @returns `Promise<Observable<DocumentData[]>>`
   *
   */
  async getObservableFromCollectionWithLimits(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    limit: number
  ): Promise<Observable<DocumentData[]>> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = this.afs.collection(path, (ref) =>
        ref.orderBy(orderKey, directionStr).limit(limit)
      );
      const queryObservable = collectionRef.valueChanges();
      return Promise.resolve(queryObservable);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param limit `number` Number of results in the query
   * @returns `Promise<DocumentData[]>`
   *
   */
  async getDataOnceFromCollectionWithLimit(
    path: string,
    orderKey: string,
    limit: number
  ): Promise<DocumentData[]> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref.orderBy(orderKey, 'desc').limit(limit)
      );
      const snapshot: any = await collectionRef.get().toPromise();
      const data: DocumentData[] = [];
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr 'desc' | 'asc' Direction of orderBy
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param limit `number` Number of results in the query
   * @returns `Promise<DocumentData[]>`
   *
   */
  async getDataOnceWithQueryFromCollectionWithLimit(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    conditionSign: WhereFilterOp,
    valueEvaluated: string | FieldPath,
    condition: string | number,
    limit: number
  ): Promise<DocumentData[]> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref
          .where(valueEvaluated, conditionSign, condition)
          .orderBy(orderKey, directionStr)
          .limit(limit)
      );
      const snapshot: any = await collectionRef.get().toPromise();
      const data: DocumentData[] = [];
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param initialRange
   * @param finalRange
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param dateKey
   * @returns `Promise<any>`
   *
   */
  async getObservableCompoundQueryFromCollectionWithRange(
    path: string,
    orderKey: string,
    initialRange: string,
    finalRange: string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string,
    dateKey: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let collectionRef: AngularFirestoreCollection;
        collectionRef = await this.afs.collection(path, (ref) =>
          ref
            .where(valueEvaluated, conditionSign, condition)
            .where(dateKey, '>=', initialRange)
            .where(dateKey, '<', finalRange)
            .orderBy(orderKey, 'desc')
        );
        const queryObservable = await collectionRef.valueChanges();
        resolve(queryObservable);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  /**
   * Method to query data from a Firestore collection without limit of documents.
   *
   * @param path `string` Path to the Collection id
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @returns `Promise<any>`
   * getQueryMoreCompoundQueryFromCollectionWithLimits
   */
  async getQueryMoreCompoundQueryFromCollectionWithLimits(
    path: string,
    orderKey: string,
    conditionSign: WhereFilterOp,
    valueEvaluated: string,
    condition: string | boolean | number,
    secondConditionSign: WhereFilterOp,
    secondValueEvaluated: string,
    secondCondition: string | boolean | number,
    thirdConditionSign: WhereFilterOp,
    thirdValueEvaluated: string,
    thirdCondition: string | boolean | number
  ): Promise<any> {
    try {
      const dataArray: any[] | PromiseLike<any[]> = [];
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref
          .where(valueEvaluated, conditionSign, condition)
          .where(secondValueEvaluated, secondConditionSign, secondCondition)
          .where(thirdValueEvaluated, thirdConditionSign, thirdCondition)
      );
      await collectionRef
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          querySnapshot.forEach(
            (queryDocumentSnapshot: QueryDocumentSnapshot<any>) => {
              dataArray.push(queryDocumentSnapshot.data());
            }
          );
        });
      return Promise.resolve(dataArray);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr 'desc' | 'asc' Direction of orderBy
   * @param conditionSign? `string` String with the conditional operator (for example: '==', '>=', etc)
   * @param valueEvaluated? `string` String of the key to be evaluated
   * @param condition? `string` String with the value for comparison
   * @param limit `number` Number of results in the query
   * @returns `Promise<Observable<DocumentData[]>>`
   *
   */
  async getQueryFromCollectionWithLimits(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc',
    conditionSign: WhereFilterOp,
    valueEvaluated: string | FieldPath,
    condition: string | number,
    limit: number
  ): Promise<any> {
    try {
      const dataArray: any[] | PromiseLike<any[]> = [];
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref
          .where(valueEvaluated, conditionSign, condition)
          .orderBy(orderKey, directionStr)
          .limit(limit)
      );
      await collectionRef
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          querySnapshot.forEach(
            (queryDocumentSnapshot: QueryDocumentSnapshot<any>) => {
              dataArray.push(queryDocumentSnapshot.data());
            }
          );
        });
      return Promise.resolve(dataArray);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to query data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr: 'desc' | 'asc',
   * @returns `Promise<DocumentData[]>`
   *
   */
  async getDataOnceFromCollectionWithoutLimit(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc'
  ): Promise<DocumentData[]> {
    try {
      let collectionRef: AngularFirestoreCollection;
      collectionRef = await this.afs.collection(path, (ref) =>
        ref.orderBy(orderKey, directionStr)
      );
      const snapshot: any = await collectionRef.get().toPromise();
      const data: DocumentData[] = [];
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Method to get data from a Firestore collection
   *
   * @param path `string` Path to the Collection id
   * @param orderKey `string` Key for order the query result
   * @param directionStr: 'desc' | 'asc',
   *
   * @returns `Promise<any>`
   *
   */
  async getAllDataFromCollectionSorted(
    path: string,
    orderKey: string,
    directionStr: 'desc' | 'asc'
  ): Promise<any> {
    try {
      const snapshot: any = await this.afs
        .collection(path, (ref) => ref.orderBy(orderKey, directionStr))
        .get()
        .toPromise();
      const data: any[] = [];
      for (const doc of snapshot.docs) {
        data.push(doc.data());
      }
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
