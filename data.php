<?php
$conn = mysql_connect("localhost","root","toor");
if (!$conn) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("earth", $conn);

$num = intval($_GET["num"]);

$sql_result = mysql_query("SELECT * FROM `detect_result` AS t1 JOIN (SELECT ROUND(RAND() * (SELECT MAX(id) FROM `detect_result`)) AS id) AS t2 WHERE t1.id >= t2.id ORDER BY t1.id ASC LIMIT ".$num.";");

$result_array = array();
while($row = mysql_fetch_array($sql_result)) {
    $line = $row['line'];
    $line_array = explode(chr(32),$line);//space
    $ip = $line_array[5];
    //$payload = $line_array[9];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://api.map.baidu.com/location/ip?ak=8wTz4tDHPkoxw9tQCYMwBkgY&coor=bd09ll&ip='.$ip);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $json_str = curl_exec($ch);
    curl_close($ch);
    $json_obj = json_decode($json_str,true);
    $address = $json_obj['content']['address'];
    $x = $json_obj['content']['point']['x'];
    $y = $json_obj['content']['point']['y'];
    if(isset($x) && isset($y)) {
        $result_array[] = $ip.','.$x.','.$y.','.$address;
    }
}

echo json_encode($result_array);

mysql_close($conn);
?>
