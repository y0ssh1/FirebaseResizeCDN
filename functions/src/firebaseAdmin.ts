import * as admin from "firebase-admin";

admin.initializeApp();
export const storage = admin.storage();
