<?php
require_once(dirname(__FILE__) . '/lib/Coinbase.php');

//post receive address and ammount to OAuth.
//authorize
//execute transaction to receive address 

// Create an application at https://coinbase.com/oauth/applications and set these values accordingly
$_CLIENT_ID = "xxxx";
$_CLIENT_SECRET = "xxxx";

// Note: your redirect URL should use HTTPS.
$_REDIRECT_URL = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];

$coinbaseOauth = new Coinbase_OAuth($_CLIENT_ID, $_CLIENT_SECRET, $_REDIRECT_URL);
if(isset($_GET['code'])) {
	//echo $_GET['code'];
    // Request tokens
    $tokens = $coinbaseOauth->getTokens($_GET['code']);

    // The user is now authenticated! Access and refresh tokens are in $tokens
    // Store these tokens safely, and use them to make Coinbase API requests in the future.
    // For example:
    $coinbase = new Coinbase($coinbaseOauth, $tokens);
	
	if(isset($_GET['email']) && isset($_GET['amount'])) {
		//$response = $coinbase->sendMoney($_GET['email'], $_GET['amount']);
	}

    try {
        echo 'Balance: ' . $coinbase->getBalance() . '<br>';
    } catch (Coinbase_TokensExpiredException $e) {
        $newTokens = $coinbaseOauth->refreshTokens($tokens);
        // Store $newTokens and retry request
    }
} else {

    // Redirect to Coinbase authorization page
    // The provided parameters specify the access your application will have to the
    // user's account; for a full list, see https://coinbase.com/docs/api/overview
    // You can pass as many scopes as you would like
    echo $coinbaseOauth->createAuthorizeUrl("balance");
}
