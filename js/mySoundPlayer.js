let fileSrc = document.getElementById('audioFile');
let sound = document.getElementById('soundControls');
fileSrc.addEventListener('change', function(e){
  console.log(e)
  sound.src = URL.createObjectURL(fileSrc.files[0]);
  // not really needed in this exact case, but since it is really important in other cases,
  // don't forget to revoke the blobURI when you don't need it
  sound.onend = function(e) {
    URL.revokeObjectURL(fileSrc.src);
  }
});
