import path from 'path';
import admin from 'firebase-admin';

export const BUCKET_NAME = 'project-fl-361708.appspot.com'; //gs://project-fl-361708.appspot.com/

export default async function FirebaseInit() {
  var serviceAccount = require(path.join(
    process.cwd(),
    'config/firebase/serviceAccountKey.json'
  ));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET_NAME,
  });
}
