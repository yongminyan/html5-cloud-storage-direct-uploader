<?php
include_once('configure.php');

function insert_link($linkURL, $cloudType) {
    try {
        $db = new PDO("mysql:host=" . DB_HOST_IP . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER_NAME, DB_USER_PASSWORD);
        $stmt = $db->prepare("INSERT INTO CloudLinks(`LinkString`, `CloudType`) VALUES(?, ?)");
        if (!$stmt->execute(array($linkURL, $cloudType))) {
            echo "PDOStatement::errorInfo(): <br/>";
            $arr = $stmt->errorInfo();
            print_r($arr);
        }
        $db = null;
    } catch (PDOException $e) {
        echo "Error!: " . $e->getMessage() . "<br/>";
        die();
    }
}

function iso_date($timestamp = null) {
  $tz = @date_default_timezone_get();
  @date_default_timezone_set('UTC');
  
  if (is_null($timestamp)) {
      $timestamp = time();
  }
      
  $returnValue = str_replace('+00:00', '.0000000Z', @date('c', $timestamp));
  @date_default_timezone_set($tz);
  return $returnValue;
}
 
function generate_azure_query_string($fileName, $permit='r') {

    $start = iso_date(time() - 300); 	
    $expires = iso_date(time() + 300); 

    $sig = createSignature(
                AZURE_BLOB_ACCOUNT_NAME, 
                AZURE_BLOB_PRIMARY_KEY,
                AZURE_BLOB_CONTAINER . "/" . $fileName, 
                $start, $expires, $permit);

    $params = array();
    $params[] = 'sp=' . $permit; 
    $params[] = 'st=' . urlencode($start);
    $params[] = 'se=' . urlencode($expires);
    $params[] = 'sr=b'; 
    $params[] = 'sig=' . urlencode($sig);

    return implode('&', $params);
}

function createSignature($accountName, $accountKey, $resourceFullPath, $start, $expires, $permits='w') 
{
    $res = "/" . AZURE_BLOB_ACCOUNT_NAME . $resourceFullPath; 
    $strToSign = array();
    $strToSign[] = $permits;     
    $strToSign[] = $start;
    $strToSign[] = $expires;
    $strToSign[] = $res; 
    $sig = base64_encode(hash_hmac('sha256', implode('\n', $strToSign), base64_decode(AZURE_BLOB_PRIMARY_KEY), true)); 
    return $sig;
}

?>
