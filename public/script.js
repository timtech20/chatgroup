import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyB1yCos0o7Yg6SAfkbyYvjzaBlyBX-4Fgk",
  authDomain: "level-2-pro-ec7a2.firebaseapp.com",
  databaseURL: "https://level-2-pro-ec7a2-default-rtdb.firebaseio.com",
  projectId: "level-2-pro-ec7a2",
  storageBucket: "level-2-pro-ec7a2.appspot.com",
  messagingSenderId: "142882773417",
  appId: "1:142882773417:web:52c047b94285321efd4cb8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const provider2 = new GithubAuthProvider();
const database = getDatabase(app);
// const userOut = new signOut()

const signGoogle = () => {
  // alert('hello')
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log('email sent');
      window.location.href = 'dashboard.html'
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    });

}
window.signGoogle = signGoogle

const signGithub = () => {
  signInWithPopup(auth, provider2)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location.href = 'dashboard.html'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GithubAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential, error);
    });


}

window.signGithub = signGithub


const signOuted = () => {
  let yesss = confirm('are sure you want to sign out')
  if(yesss==true){
  signOut(auth)
    .then(() => {
      console.log('User signed out');
      window.location.href = 'index.html'
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
  }
  
  else{
    window.location.href = 'dashboard.html'
  }

};
window.signOuted = signOuted;

const userLogin = () => {
  let userEmail = document.getElementById('email').value
  let userPassword = document.getElementById('passWord').value
  if (userEmail === "" || userPassword === "") {
    document.getElementById('throwError').innerHTML = "Fill the empty input"
    setTimeout(() => {
      document.getElementById('throwError').innerHTML = ""
    }, 3000)
  }

  else {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        window.location.href = 'dashboard.html'
        const user = userCredential.user;
        console.log(user);
        fetchAndDisplayUserData(user.uid);

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/user-not-found') {
          // document.getElementById('trowError').innerHTML = "User not found. Please sign up first.";
        }

        else {
          // document.getElementById('throwError').innerHTML = errorMessage;
          document.getElementById('throwError').innerHTML = "the email or password is not correct";
        }
        setTimeout(() => {
          document.getElementById('throwError').innerHTML = "";
        }, 5000);
      });
  }

}

window.userLogin = userLogin

const signUp = () => {
  let userFirstName = document.getElementById('fistName').value
  let userLastName = document.getElementById('lastName').value
  let userUpEmail = document.getElementById('upEmail').value
  let userUpPassword = document.getElementById('upPassword').value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (userFirstName == "" || userLastName == "" || userUpEmail == "" || userUpPassword == "") {
    document.getElementById('upThrowError').style="background-color: rgb(247, 177, 177);     color: rgb(170, 4, 4); height: 30px;"
    document.getElementById('upThrowError').innerHTML = "Fill the empty input"
    setTimeout(() => {
        document.getElementById('upThrowError').style=""
      document.getElementById('upThrowError').innerHTML = "";
    }, 5000);
  }

  else if (!passwordRegex.test(userUpPassword)) {
    document.getElementById('upThrowError').style="background-color: rgb(247, 177, 177);     color: rgb(170, 4, 4); height: 30px; font-size: 12px;"
    document.getElementById('upThrowError').innerHTML = "Weak Password()";
    setTimeout(() => {
      document.getElementById('upThrowError').style=""
      document.getElementById('upThrowError').innerHTML = "";
    }, 5000);
  }

  else if(!emailRegex.test(userUpEmail)){
        document.getElementById('upThrowError').style="background-color: rgb(247, 177, 177);     color: rgb(170, 4, 4); height: 30px"
    document.getElementById('upThrowError').innerHTML="Enter a valid email address"
    setTimeout(() => {
      document.getElementById('upThrowError').style=""
      document.getElementById('upThrowError').innerHTML = "";
    }, 5000);
  }

  else {

    createUserWithEmailAndPassword(auth, userUpEmail, userUpPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        const userId = user.uid;
        let userData = {
          firstName: userFirstName,
          lastName: userLastName,
          email: userUpEmail
        };
        let dbRef = ref(database, `users/${userId}`);
        set(dbRef, userData);
        document.getElementById('upThrowError').style="background-color: rgb(173, 240, 173); color: rgb(5, 59, 5); height: 30px ;"
        document.getElementById('upThrowError').innerHTML = "Account created successful";
        setTimeout(() => {
          document.getElementById('upThrowError').innerHTML = "";
        }, 5000);
        
        setTimeout(() => {
          window.location.href = 'index.html'
        }, 4000);

        
        
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('upThrowError').style="background-color: rgb(247, 177, 177);     color: rgb(170, 4, 4); height: 30px"
        document.getElementById('upThrowError').innerHTML="Email already in use"
        setTimeout(() => {
          document.getElementById('upThrowError').style=""
          document.getElementById('upThrowError').innerHTML = "";
        }, 5000);
        console.log(errorCode, errorMessage, error);
      });
  }
}

window.signUp = signUp

const resetPassword = () => {
  const email = document.getElementById('resetEmail').value;

  if (email === "") {
    document.getElementById('resetError').innerHTML = "Please enter your email address";
    setTimeout(() => {
      document.getElementById('resetError').innerHTML = "";
    }, 3000);
  } else {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        document.getElementById('resetError').innerHTML = "Password reset email sent!";
        setTimeout(() => {
          document.getElementById('resetError').innerHTML = "";
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('resetError').innerHTML = "User not found or invalid email Address";
        setTimeout(() => {
          document.getElementById('resetError').innerHTML = "";
        }, 3000);
      });
  }
}

window.resetPassword = resetPassword;




const fetchAndDisplayUserData = (userId) => {
  const dbRef = ref(database, `users/${userId}`);
  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById('firstNameDisplay').innerText = userData.firstName;
        document.getElementById('lastNameDisplay').innerText = userData.lastName;
        window.location.href = 'dashboard.html';
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};




