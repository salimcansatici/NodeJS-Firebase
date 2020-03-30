var firebaseConfig = {
    //Firebase veri configleri
  };


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


firebase.auth.Auth.Persistence.LOCAL;



  $("#btn-login").click(function()
  {
    var email = $("#email").val();
    var password = $("#password").val();

    if(email != "" && password != "")
    {
        var result = firebase.auth().signInWithEmailAndPassword(email,password);
        result.catch(function(error)
        {

            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorCode);
            window.alert("Message : "+ errorMessage);

        });

    }
    else{
    window.alert("Form is incomplete. Please fill all fields.");

    }
  });




  $("#btn-logout").click(function()
  {
   firebase.auth().signOut();
  });