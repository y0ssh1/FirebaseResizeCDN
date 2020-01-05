# FirebaseResizeCDN
Build CDN with image resizing using firebase(FirebaseHosting + CloudFunction)

# Setup

```
npm install
firebase login
firebase functions:config:set storage.bucket="YOUR STORAGE BUCKET NAME"
```

# Deploy

```
firebase deploy
```

If you have some projects

```
firebase deploy -P YOUR_FIREBASE_PROJECT_NAME
```

# Usage

```
your_project_id.firebaseapp.com/images/image_name.png?size=(width: number | undefined)x(height: number | undefined)
```

center crop | resize keeping aspect ratio
------------|----------------------
![スクリーンショット 2020-01-05 9 23 57](https://user-images.githubusercontent.com/19838174/71773277-e1082600-2f9d-11ea-851d-e457237a4600.png) | ![スクリーンショット 2020-01-05 9 24 10](https://user-images.githubusercontent.com/19838174/71773279-e2d1e980-2f9d-11ea-91f2-f515b753afc3.png)
