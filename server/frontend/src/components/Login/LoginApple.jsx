import React from "react";
import AppleSignin from "react-apple-signin-auth";

const AppleLogin = () => {
  const handleSuccess = (response) => {
    console.log("Apple sign-in success:", response);
  };

  const handleError = (error) => {
    console.error("Apple sign-in error:", error);
  };

  return (
    <div>
      <AppleSignin
        authOptions={{
          clientId: "com.your-client-id", // Your Apple client ID
          redirectURI: "https://your-redirect-uri.com/callback", // Your redirect URI
          scope: "email name", // What user data you want
          state: "state", // CSRF protection
          usePopup: true, // Open sign-in in a popup
        }}
        render={(props) => (
          <button {...props} className="apple-login-button">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" // Link to the Apple logo
              alt="Sign in with Apple"
              className="apple-logo"
            />
          </button>
        )}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default AppleLogin;
