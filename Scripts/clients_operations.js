function preview_image() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("imageInput").files[0]);
    oFReader.onload = function (oFREvent) {
        document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
};

function base_name(fullPath) {
    if (null == fullPath)
        return ;
	return fullPath.replace(/^.*[\\\/]/, '');
}

function upload_s3_inner(authentication, fileData, fileName) {
    var jsonObj = JSON.parse(authentication);

	var fd = new FormData();
	var uploadFileName = jsonObj['foldername'] + '/' + fileName;

	fd.append('key', uploadFileName);
	fd.append('AWSAccessKeyId', jsonObj['accesskeyid']); 
    fd.append('acl', 'public-read');
	fd.append('policy', jsonObj['policy']); 
    fd.append('signature', jsonObj['signature']); 
    fd.append("file", fileData, uploadFileName);

	strActionPage = jsonObj['baseurl'] + '/' + jsonObj['bucketname'] + '/';

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
            window.alert("Image Uploaded to S3!");
		}
	}

    try {
        xhr.open('POST', strActionPage);
        xhr.send(fd);
    }
    catch (e) {
        window.alert("can't upload the image to server.\n" + e.toString());
    }
}


function btn_upload_S3_onclick() 
{
    var fileInputElement = document.getElementById('imageInput');
    if ('' == fileInputElement.value) {
		window.alert("Empty FIle");
		return ;
	}

	var fileName = base_name(fileInputElement.value);
    var fileData = fileInputElement.files[0];

    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			upload_s3_inner(xhr.responseText, fileData, fileName);
		}
	}
	var actionPageFullPath = 'query_authentication.php?cloudsource=s3&imagename=' + fileName;
	xhr.open('GET', actionPageFullPath, true);
	xhr.send(null);
}

function upload_azure_inner(blobSASUrl, fileData) {
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
            window.alert("Image Uploaded to Azure!");
		}
	}

    try {
        xhr.open('PUT', blobSASUrl, true);
	    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.send(fileData);
    }
    catch (e) {
        window.alert("can't upload the image to server.\n" + e.toString());
    }
}


function btn_upload_Azure_onclick() {
    var fileInputElement = document.getElementById('imageInput');
	if ('' == document.getElementById('imageInput').value) {
		window.alert("Empty FIle");
		return ;
	}

	var uploadFileName = base_name(fileInputElement.value);

    var fileData = fileInputElement.files[0];
    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			upload_azure_inner(xhr.responseText, fileData);
		}
	}
	var actionPageFullPath = 'query_authentication.php?cloudsource=azure&imagename=' + uploadFileName;
	xhr.open('GET', actionPageFullPath, true);
	xhr.send(null);
}
