# Firebase Setup Guide for Hashan E Solution

This application uses Firebase for Authentication (Google Login), Firestore (Database), and Storage. Because the Firebase Console requires you to be logged into your Google account, you will need to complete the following steps to get the final configuration keys.

## 1. Get Your Firebase Config Keys
1. Go to the [Firebase Console](https://console.firebase.google.com/project/project-1053536412506/settings/general) (ensure you are logged in).
2. Scroll down to the **"Your apps"** section.
3. If you haven't created a Web App yet, click the `</>` (Web) icon to add an app. Register the app (you don't need Firebase Hosting for now).
4. You will see a `firebaseConfig` object that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "project-1053536412506.firebaseapp.com",
     projectId: "project-1053536412506",
     storageBucket: "project-1053536412506.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
5. Open the `.env.local` file in the root of your project and replace the placeholder values with the exact values from that object.

## 2. Enable Authentication
1. In the Firebase Console sidebar, go to **Build > Authentication**.
2. Click **Get Started** (if you haven't already).
3. Go to the **Sign-in method** tab.
4. Add the **Google** provider, enable it, and save.

## 3. Set Up Firestore Database
1. Go to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** (or test mode if you prefer).
4. Go to the **Rules** tab and paste the following security rules to ensure data is protected:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles: Users can only read/write their own profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments: 
    // - Users can read/write their own appointments
    // - Anyone can create an appointment (if you want public booking)
    // - Otherwise restrict to authenticated users
    match /appointments/{docId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || true); // Note: Admin has full access anyway if using Admin SDK, but for client-side admin, you might need a custom claim or admin collection. For this app, since admin is hardcoded locally, you might want to allow read for everyone but hide the UI, or use Firebase Custom Claims for true security.
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null; // Ideally restrict to admin or owner
    }

    // Admin collections (Inventory, Finances)
    // For a production app, these should strictly be secured using Firebase Custom Claims (e.g., request.auth.token.admin == true).
    match /inventory/{docId} {
      allow read, write: if true; // WARNING: Open for now so the UI works. Update in production!
    }
    match /finances/{docId} {
      allow read, write: if true; // WARNING: Open for now so the UI works. Update in production!
    }
  }
}
```
*Note: For a fully secure admin panel in production, you should migrate the hardcoded admin login to use Firebase Authentication with Custom Claims, so you can restrict the `inventory` and `finances` collections.*

## 4. Set Up Firebase Storage
1. Go to **Build > Storage**.
2. Click **Get Started**.
3. Use the following Rules to allow authenticated users to upload their profile pictures or repair item photos:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Restart the Development Server
After updating the `.env.local` file, restart the Next.js development server:
```bash
npm run dev
```

Your system is now fully functional!
