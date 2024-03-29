import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'
// const firebaseConfig = {
//     apiKey: "AIzaSyCPKorkhQpFVV0b12XwzMPUskTfcc1zm7g",
//     authDomain: "testinternbackend.firebaseapp.com",
//     databaseURL: "https://testinternbackend-default-rtdb.firebaseio.com",
//     projectId: "testinternbackend",
//     storageBucket: "testinternbackend.appspot.com",
//     messagingSenderId: "448103004110",
//     appId: "1:448103004110:web:6d2d5728760f1fa99f9d9f"
//   };

// const firebaseConfig = {
//   apiKey: "AIzaSyClLxqZDMlHsZg9ofptNj_IsSdF_lvNylc",
//   authDomain: "poker-2c494.firebaseapp.com",
//   projectId: "poker-2c494",
//   storageBucket: "poker-2c494.appspot.com",
//   messagingSenderId: "40517616525",
//   appId: "1:40517616525:web:d5775bb9f8bd336ae7f3c4"
// };

const firebaseConfig = {
  apiKey: "AIzaSyClLxqZDMlHsZg9ofptNj_IsSdF_lvNylc",
  authDomain: "poker-2c494.firebaseapp.com",
  databaseURL: "https://poker-2c494-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "poker-2c494",
  storageBucket: "poker-2c494.appspot.com",
  messagingSenderId: "40517616525",
  appId: "1:40517616525:web:d5775bb9f8bd336ae7f3c4"
};


firebase.initializeApp(firebaseConfig)
const storage = firebase.storage();

export default storage