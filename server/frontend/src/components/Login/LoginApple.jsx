import React from "react";
import AppleSignin from "react-apple-signin-auth";
import AppleLogo from "../assets/apple-logo.svg";
import "./Login.css";

const AppleLogin = () => {
  const iconStyle = {
    transform: "translate(-1px,-1.5px)",
  };

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
          <button {...props}>
            <img src={AppleLogo} alt="Apple Logo" style={iconStyle} />
          </button>
        )}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default AppleLogin;
