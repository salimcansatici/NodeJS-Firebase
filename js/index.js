var firebaseConfig = {


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var sstorageRef;
const init = function () {
  const fileInputElement = document.querySelector('.js-file__input');
  const fileDropZone = document.querySelector('.js-dropzone');

  // Prevents the default behavior of refresh
  // Force click on the input element
  document.querySelector('.file__input-label-button').addEventListener('click', function (e) {
    e.preventDefault();
    fileInputElement.click();
  })

  // Handle Creating Elements for the files using the Browse button
  fileInputElement.addEventListener('change', function (e) {
    const validatedFiles = fileValidation([...fileInputElement.files]);
    createFileDOMNode(validatedFiles);
  });

  // Prevents default behavior of automatically opening the file
  fileDropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  // Gets node element list of files Converts them to a list of Arrays
  // Then calls createFileDOMNode to create DOM Element of the files
  fileDropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    const unvalidatedFiles = getArrayOfFileData([...e.dataTransfer.items]);
    const validatedFiles = fileValidation(unvalidatedFiles);
    createFileDOMNode(validatedFiles);
  });
};

// Validates each file that it is the format we accept
// Then pushes the validated file to a new array
const fileValidation = function (files) {
  const errMessageOutput = document.querySelector('.file-upload__error');
  const validatedFileArray = [];
  const supportedExts = ['png', 'jpg', 'doc', 'xls', 'pdf', 'ai', 'psd'];
  files.forEach(file => {
    const ext = getFileExtension(file);
    if (supportedExts.indexOf(ext) === -1) {
      let errMessage =
        'Please upload a .doc, .png, .psd, .pdf, .ai, .xls or .jpg file only.';
      errMessageOutput.style.display = 'block';
      errMessageOutput.textContent = errMessage;
      // return '';
    } else {
      errMessageOutput.style.display = 'none';
      validatedFileArray.push(file);
    }
  });
  return validatedFileArray;
};

// Returns an array of the file data
const getArrayOfFileData = function (files) {
  const fileDataArray = [];
  files.forEach(file => {
    if (file.kind === 'file') {
      fileDataArray.push(file.getAsFile());
    }
  });
  return fileDataArray;
};

// Creates list item DOM nodes for each file uploaded
const createFileDOMNode = function (files) {
  const fileList = document.querySelector('.js-file__list');

  files.forEach(file => {
    // Create a DOM element(s) for each file dropped
    const listItemElement = document.createElement('li');
    const fileDetailsContainer = document.createElement('div');
    const fileOutputListItemImage = document.createElement('img');
    const fileOutputListItemName = document.createElement('span');
    const fileOutputListItemSVGIsComplete = document.createElement('img');
    const fileOutputListItemProgressBar = document.createElement('progress');

    // Append elements to the DOM and parent components to the elements
    fileList.appendChild(listItemElement);
    listItemElement.appendChild(fileOutputListItemImage);
    listItemElement.appendChild(fileDetailsContainer);
    fileDetailsContainer.appendChild(fileOutputListItemName);
    fileDetailsContainer.appendChild(fileOutputListItemSVGIsComplete);
    fileDetailsContainer.appendChild(fileOutputListItemProgressBar);

    // Add classs to the create element
    listItemElement.classList.add('file-output__list-item');
    fileDetailsContainer.classList.add('file-details__container');
    fileOutputListItemImage.classList.add('file-output__list-item-image');
    fileOutputListItemSVGIsComplete.classList.add(
      'file-output__list-item--is-complete'
    );
    fileOutputListItemName.classList.add('file-output__list-item-name');
    fileOutputListItemProgressBar.classList.add('file-output__progress-bar');

  
      fileOutputListItemSVGIsComplete
    );
  });
};

const updateDatabase = function (
  file,
  progressBarElement,
  fileNameTextElement,
  fileTypeImageElement,
  fileCompletionImageElement
) {
  // Create a storage ref
  var storageRef = firebase.storage().ref('competitions/' + uniqueCompetitionKey + '/' + file.name);
sstorageRef = storageRef;
  // Upload a file
  let task = storageRef.put(file);
  
  // Set progress bar initial and max values
  progressBarElement.value = 0;
  progressBarElement.max = 100;

  // Update progress bar
  task.on(
    'state_changed',
    function progress(snapshot) {
      const percentage =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBarElement.value = percentage;
      progressBarElement.classList.add('progress-bar--in-progress');
      fileCompletionImageElement.src =
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-close.svg';
    },

    function error(err) {
      console.log('An error has occured!');
    },

    function complete() {
      fileNameTextElement.style.opacity = '1';
      fileTypeImageElement.style.opacity = '1';
      progressBarElement.classList.add('progress-bar--is-finished');
      fileCompletionImageElement.src =
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-check.svg';
    }
  );
};
// Returns the files type extension
const getFileExtension = function (file) {
  return file.name.split('.').pop();
};

// Associates what svg gets matched to what type of file uploaded
const setAssociatedSVGWithFileType = function (ext, nodeElement) {
  switch (ext) {
    case 'jpg':
      nodeElement.setAttribute(
        'src',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-jpg.svg'
      );
      break;
    case 'png':
      nodeElement.setAttribute(
        'src',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-png.svg'
      );
      break;
    case 'doc':
      nodeElement.setAttribute(
        'src',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-doc.svg'
      );
      break;
    case 'ai':
      nodeElement.setAttribute(
        'src',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-ai.svg'
      );
      break;
    case 'psd':
      nodeElement.setAttribute(
        'src',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-psd.svg'
      );
      break;
   
      nodeElement.setAttribute(
        'src',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-xls.svg'
      );
      break;
    default:
      return '';
  }
};

// Truncates a string if too long
const truncateString = function (str, num) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

init();

firebase.auth.Auth.Persistence.LOCAL;



$("#btn-login").click(function () {
  var email = $("#email").val();
  var password = $("#password").val();

  if (email != "" && password != "") {
    var result = firebase.auth().signInWithEmailAndPassword(email, password);
    result.catch(function (error) {

      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode);
      window.alert("Message : " + errorMessage);

    });

  }
  else {
    window.alert("Form is incomplete. Please fill all fields.");

  }
});


$("#btn-signup").click(function () {
  var email = $("#email").val();
  var password = $("#password").val();
  var cPassword = $("#confirmPassword").val();
  if (email != "" && password != "" && cPassword != "") {
    if (password == cPassword) {
      var result = firebase.auth().createUserWithEmailAndPassword(email, password);
      result.catch(function (error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        window.alert("Message : " + errorMessage);

      });
    }
    else {
      window.alert("Password do not match with the Confirm Password.");

    }

  }
  else {
    window.alert("Form is incomplete. Please fill all fields.");

  }
});



$("#btn-resetPassword").click(function () {
  var auth = firebase.auth();
  var email = $("#email").val();

  if (email != "") {

    auth.sendPasswordResetEmail(email).then(function () {

      window.alert("Email has been sent you.");

    })
      .catch(function (error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        ß

  } else {

    window.alert("Please write your email first.");

  }

});





$("#btn-logout").click(function () {
  firebase.auth().signOut();
});


$("#btn-update").click(function () {


  alert(sstorageRef);

var a = sstorageRef;
  let date = new Date();
  let simdikiDakika = date.getMinutes();
  let simdikiSaat = date.getHours();
  let simdikiGun = date.getDate();
  let simdikiYil = date.getFullYear();
  let simdikiAy = date.getMonth();
  var InsertDate = simdikiGun + ":" + simdikiAy + ":" + simdikiYil;
  console.log(simdikiGun + "/" + simdikiAy + "/" + simdikiYil);

  var yarismaAdi = $("#yarismaAdi").val();
  var onbilgilendirme = $("#onbilgilendirme").val();
  var kategori = $("#kategori").val();
  var aciklama = $("#aciklama").val();



  var CompetitionInfo = {
    "Name": yarismaAdi,
    "Category": kategori,
    "InsertDate": InsertDate,
    "Description": aciklama,
    "Uid": uniqueCompetitionKey,
    "CompetitionPhoto": a+"",
  };
  var Competition = {

  };




  //var userID = firebase.auth().currentUser.uid;

  var usersRef = rootRef.child(uniqueCompetitionKey);

  if (yarismaAdi != "" && kategori != "" && aciklama != "") {


    usersRef.set(CompetitionInfo, function (error) {
      if (error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);
        window.alert("Message : " + errorMessage);
      }
      else {
        window.alert("");
        window.location.href = "accountSettings.html";
      }
    });











  }
  else {
    window.alert("Please write your email first.");

  }

});