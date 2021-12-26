// https://github.com/mikethedj4/WebDGap

function download() {
	JSZipUtils.getBinaryContent("test.zip", function(err, data) {
		if(err) {
			throw err;
		}
		
		var zip = new JSZip();
		zip.loadAsync(data).then(function (zip) {
			var data_folder = zip.folder("data");
			data_folder.file("test.txt", "Test");
			
			zip.generateAsync({type:"base64"}).then(function (content) {
				// copy Load bar from nbt crafting
				var link = document.createElement('a');
				link.download = "NBT-Crafting";
				link.href = "data:application/zip;base64," + content;
				link.click();
			});
		});
	});
}

