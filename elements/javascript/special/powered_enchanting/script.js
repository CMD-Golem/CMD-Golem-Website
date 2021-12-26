// <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js"></script>

// https://github.com/mikethedj4/WebDGap

$(document).ready(function() {
  //Detect if users browser can load and download files in Javascript
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Detect if users browser can download files in Javascript
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }
  
  // Trigger Load File
  $(".loadzip").on("click", function() {
    $("#file").trigger("click");
  });
  
  // Show contents
  //var $result = $(".result");
  $("#file").on("change", function(evt) {
	  
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function() {
        return function(e) {
          var webAppZipBinary = e.target.result;
          
          // Download as Linux App
            JSZipUtils.getBinaryContent("test.zip", function(err, data) {
              if(err) {
                throw err; // or handle err
              }
              
              var zip = new JSZip();
              zip.loadAsync(data).then(function (zip) {
				zip.loadAsync(webAppZipBinary).then(function (zip) {
              
					// Your Web App
					var data_folder = zip.folder("data");
					data_folder.file("test.txt", "Test");
					
					zip.generateAsync({type:"base64"}).then(function (content) {
						var link = document.createElement('a');
						link.download = "NBT-Crafting";
						link.href = "data:application/zip;base64," + content;
						link.click();
					});
				});
			  });
            });

        }
      })(f);

      // read the file
      reader.readAsArrayBuffer(f);
    }
  });
  return false;
});
