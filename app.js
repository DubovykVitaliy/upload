import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { upload } from './upload.js';
//
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCaJ-h64nt8yJajVeHFGfZnBMfSDWJrUiU',
  authDomain: 'fe-upload-15c49.firebaseapp.com',
  projectId: 'fe-upload-15c49',
  storageBucket: 'fe-upload-15c49.appspot.com',
  messagingSenderId: '1002605103656',
  appId: '1:1002605103656:web:03c7af557b91575b41c31d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const storageRef = ref(storage);
function onUpload(files, infoBlocks) {
  //
  files.forEach((file, index) => {
    const fileRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    //
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const block = infoBlocks[index].querySelector('.preview__info--progress');
        block.textContent = progress.toFixed(0);
        block.style.width = `${progress}%`;
      },
      //
      (error) => {
        console.log(error);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      //
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
    //
  });
}
// console.log(storage);
upload('#file', {
  multi: 'true',
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload,
});
