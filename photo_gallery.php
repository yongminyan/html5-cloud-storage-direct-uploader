<!doctype html>
<html lang="en">
<head>
<!-- Notice:
     This is code is based on the following tutorial 
     http://www.elated.com/articles/elegant-sliding-image-gallery-with-jquery/
-->
<title>Cloud Storage Sliding Image Gallery</title>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">

<script type="text/javascript" src="Scripts/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="Scripts/jquery.jswipe-0.1.2.js"></script>
<link rel="stylesheet" type="text/css" href="Styles/photo_gallery_style.css">

</head>

<body>
  <button id="leftButton" onclick='moveLeft()'>&lt;</button>
  <button id="rightButton" onclick='moveRight()'>&gt;</button>
  <div id="galleryContainer">
    <div id="gallery">

<?php

include_once('configure.php');
include_once('common.php');

$whichCloud = $_GET["cloudsource"]; // "/foo.pdf"; // assume it is fine
$db = new PDO("mysql:host=" . DB_HOST_IP . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER_NAME, DB_USER_PASSWORD);
$stmt = $db->prepare("SELECT * FROM CloudLinks WHERE CloudType=?");

$ret = FALSE;
if (0 == strcmp($whichCloud, "s3")) {
    $ret = $stmt->execute(array(0));
    $rows1 = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach( $rows1 as $row ) {
        echo "<img src='" . $row['LinkString'] . "' /> \n";
    }
}
else if (0 == strcmp($whichCloud, "azure")){
    $ret = $stmt->execute(array(1));
    $rows2 = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach( $rows2 as $row ) {
        $rawURL = $row['LinkString'];
        $fileName = basename($rawURL);
        $queryStr = generate_azure_query_string($fileName, 'r');
        echo "<img src='" . $rawURL . "?" . $queryStr . "' /> \n";
    }
}
else {
    echo "error: invalid url query strings!";
}


if (!$ret) {
    echo "\nPDOStatement::errorInfo():\n";
    $arr = $stmt->errorInfo();
    print_r($arr);
}

$db = null;

?>
    </div>
  </div>

<script type="text/javascript" src="Scripts/photo_gallery.js"></script>

</body>
</html>

