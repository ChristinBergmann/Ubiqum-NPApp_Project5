/////----------------------building LOGIN Page--------------------------//////

function buildChat(documents) {
    const { name, message } = documents;
    // console.log(documents)
  
    let chat = document.getElementById("chatPage");
  
    let messageDiv = document.createElement("div");
    messageDiv.setAttribute("id", "messages");
    let post = document.createElement("p");
    post.innerHTML = message;
    let user = document.createElement("p");
    user.innerHTML = name;
  
    chat.appendChild(messageDiv);
    messageDiv.appendChild(user);
    messageDiv.appendChild(post);
  }
  
  ////////--------------------------------------setting up firebase----LOGIN and CHAT Functions------------------------------///////
  
  firebase.initializeApp(firebaseConfig);
  
  let username = "";
  let provider = new firebase.auth.GoogleAuthProvider();
  let db = firebase.firestore();
  
  function login() {
    document.getElementById("firstPage").style.visibility = "hidden";
    firebase.auth().signInWithRedirect(provider);
  }
  
  let loggedIn = false;
  firebase
    .auth()
    .getRedirectResult()
    .then(function (result) {
      if (result.credential) {
        // This gives a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
      }
      // The signed-in user info.
      let user = result.user;
  
      if (user !== null) {
        username = user.displayName;
        email = user.email;
  
        console.log("user", user);
        loggedIn = true;
  
        document.getElementById("chatPage").classList.add("active");
        document.getElementById("firstPage").classList.remove("active");
  
        renderUser(user);
        renderChatPage();
        readMessages();
      }
    })
    .catch(function (error) {
      // Handle Errors here.
      console.log("error", error);
    });
  
  ///-----------creates the headline where it shows which user is logged in--------------///
  
  function renderUser(user) {
    let userEl = document.getElementById("user");
  
    let userName = document.createElement("p");
    userName.innerHTML = user.displayName;
    let imgEl = document.createElement("img");
    imgEl.setAttribute("src", user.photoURL);
    imgEl.setAttribute("class", "avatar");
    let chatHeadline = document.createElement("p");
    chatHeadline.innerHTML = "Let`s chat !!!";
  
    userEl.appendChild(userName);
    userEl.appendChild(imgEl);
    userEl.appendChild(chatHeadline);
  }
  
  ////-----supposed to display the  message type in field ,log out and back button--------///
  
  function renderChatPage() {
    let chatPage = document.getElementById("chatPage");
  
    let chatMain = document.createElement("div");
    chatMain.setAttribute("id", "loggedIn");
    let chatInput = document.createElement("input");
    chatInput.setAttribute("id", "chatInput");
    let chatBTN = document.createElement("button");
    chatBTN.setAttribute("id", "messageBTN");
    chatBTN.innerHTML = "Send Message";
    chatBTN.addEventListener("click", function () {
      writeMessages();
    });
  
    let logoutDiv = document.createElement("div");
    logoutDiv.setAttribute("class", "logoutDiv");
    let logoutBTN = document.createElement("button");
    logoutBTN.setAttribute("id", "logoutBTN");
    logoutBTN.innerHTML = "Log Out";
    logoutBTN.className = "btn waves-effect waves-teal";
    logoutBTN.addEventListener("click", function () {
      logout();
    });
    //------creates BACK button-to first page-------//
    let backButton4 = document.createElement("div");
    backButton4.setAttribute("id", "backBTN");
  
    let button4 = document.createElement("button");
    button4.setAttribute("id", "button");
    button4.innerHTML = "BACK";
    button4.className = "btn waves-effect waves-teal";
    button4.addEventListener("click", function () {
      document.getElementById("firstPage").classList.add("active");
      document.getElementById("chatPage").classList.remove("active");
    });
  
    chatMain.appendChild(chatInput);
    chatMain.appendChild(chatBTN);
    chatMain.appendChild(logoutDiv);
    logoutDiv.appendChild(logoutBTN);
    backButton4.appendChild(button4);
    chatMain.appendChild(backButton4);
    chatPage.appendChild(chatMain);
    chatPage.appendChild(logoutDiv);
  }
  
  function writeMessages() {
    let input = document.getElementById("chatInput").value;
    console.log("input", input);
  
    let date = new Date();
  
    db.collection("messages")
      .add({
        message: input,
        name: username,
        date: date,
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        readMessages();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
  
  function readMessages() {
    document.getElementById("messages");
  
    db.collection("messages")
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
  
          const documents = doc.data();
          buildChat(documents, chatPage);
        });
      })
      .settings({
        timestampsInSnapshots: true,
      });
  }
  console.log("db", db);
  
  function logout() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        loggedIn = false;
  
        document.getElementById("firstPage").classList.add("active");
        document.getElementById("chatPage").classList.remove("active");
  
        console.log("sign out was succesful");
      })
      .catch(function () {
        console.log("Error with logout");
      });
  }
  