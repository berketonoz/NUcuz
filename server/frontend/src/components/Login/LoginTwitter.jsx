import React from 'react';
// import TwitterLogin from 'react-twitter-login';
import TwitterLogo from '../assets/twitter-logo.svg'; // Replace with your Twitter SVG/logo path
import "./Login.css"

const TwitterLoginCustom = () => {
  const authHandler = (err, data) => {
    if (err) {
      console.error('Twitter login error:', err);
    } else {
      console.log('Twitter login success:', data);
    }
  };

  return (
    // <TwitterLogin
    //   authCallback={authHandler}
    //   consumerKey="YOUR_CONSUMER_KEY"
    //   consumerSecret="YOUR_CONSUMER_SECRET"
    //   callbackUrl="YOUR_CALLBACK_URL"
    //   className='twitter-login-wrapper'
    //   render={(props) => (
        <button>
          <img src={TwitterLogo} alt="Twitter Logo" />
        </button>
    //   )}
    // />
  );
};

export default TwitterLoginCustom;
