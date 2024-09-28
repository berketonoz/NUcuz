import React from "react";
import AppleSignin from "react-apple-signin-auth";

const AppleLogin = () => {
  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%", // Make it circular
  };

  const iconStyle = {
    fontSize: "24px", // Adjust icon size as needed
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
          <button {...props} style={buttonStyle} className="apple-login-button">
            <i className="fab fa-apple" style={iconStyle} />
          </button>
        )}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default AppleLogin;
