# Dusty Cole Music

Site for a local musician. Left Jukebox in despite note functional yet. That is a big passion project down the line. But once it's done I can use the code from here. 

Below rules cause issue with events in firebase

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Messages/{message} {
      allow read: if request.auth.uid == 'someuserlongstring' || request.auth.uid == 'anotheruserlongstring';
      allow write: if true;
    }

    match /{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == 'someuserlongstring' || request.auth.uid == 'anotheruserlongstring';
    }
  }
}