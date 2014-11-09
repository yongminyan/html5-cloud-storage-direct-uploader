<!DOCTYPE html>
<html>
<head> 
    <meta charset="UTF-8">
    <script type="text/javascript" src="Scripts/jquery-1.4.2.min.js"></script>
    <link rel="stylesheet" type="text/css" href="Styles/style.css">
    <title>Cloud Storage Direct Uploader, Tracker, Viewer</title>
</head>

<body>

<center>

<h1>Cloud Storage Direct Uploader, Tracker, Viewer</h1><br/>

<div id="galleryLink">
    View Photo Gallery: 
    <a href="photo_gallery.php?cloudsource=s3" target="_blank"> Amazon S3 </a> |
    <a href="photo_gallery.php?cloudsource=azure" target="_blank"> Microsoft Azure Blob</a> 
</div> <br/>

<div id="selectionInput">
	<input type="file" id="imageInput" onchange="preview_image();" />
	<input type="button" value="Upload To S3" onclick ="btn_upload_S3_onclick()"/>
	<input type="button" value="Upload To Azure" onclick ="btn_upload_Azure_onclick()"/>
</div> <br/>

<div id="previewImage"> <b>Preview</b> <br/> <img id="uploadPreview" /> </div> 

</center>


<script src="Scripts/clients_operations.js"></script>
</body>

</html>
