<?php
include_once('configure.php');
include_once('common.php');

function generate_amazon_s3_signature($fileName) {
    $expiresTime = iso_date(time() + 300); 

    $jsonPolicy = json_encode(array(
        'expiration' => $expiresTime, 
        'conditions' => array(
            array(
                'bucket' => AMAZON_S3_BUCKET
            ),
            array(
                'starts-with',
                '$key',
                AMAZON_S3_FOLDER, 
            ),
            array(
                'acl' => 'public-read'
            )
        )
    ));

    $base64Policy       = base64_encode($jsonPolicy);
    $base64Signature    = base64_encode(hash_hmac("sha1", $base64Policy, AMAZON_S3_SECRET_KEY, $raw_output = true));

    $retData = json_encode(array(
        'baseurl'     => AMAZON_S3_BASE_URL,
        'bucketname'  => AMAZON_S3_BUCKET,
        'foldername'  => AMAZON_S3_FOLDER,
        'accesskeyid' => AMAZON_S3_ACCESS_KEY, 
        'policy'      => $base64Policy, 
        'signature'   => $base64Signature
    ));

    $linkURL = AMAZON_S3_BASE_URL . "/" . AMAZON_S3_BUCKET . "/" . AMAZON_S3_FOLDER . "/" . $fileName;
    insert_link($linkURL, 0);
    return $retData;
}

function generate_azure_blob_sas($fileName) {
    $queryStr = generate_azure_query_string($fileName, 'w');
    $url = AZURE_BASE_URL . "/" . $fileName . "?" . $queryStr;
    insert_link(AZURE_BASE_URL . "/" . $fileName, 1);
    return $url;
}

$whichCloud = $_GET["cloudsource"]; 
$fileName   = $_GET["imagename"];

if (0 == strcmp($whichCloud, "s3")) {
    echo generate_amazon_s3_signature($fileName);  // json data
}
else if (0 == strcmp($whichCloud, "azure")){
    echo generate_azure_blob_sas($fileName);       // sas: signed url
}
else {
    // echo some indicator instead:
    echo "error in query_authentication.php: invalid url query strings!";
}

?>
