import React from 'react';
import Form from '../../designs/Authentication/Form';

const SignIn = () => {
    return (

        <div className="sign-in-container">
            <div className="left-section">
                <h1>Sign In to Continue with TransConnect</h1>
                <p>
                    If you don’t have an account
                    <a href="/register" className="register-link"> Register here!</a>
                </p>
            </div>
            <div className="right-section">
                <Form  route="api/token/" method="login"/>
            </div>
        </div>

    )
}

export default SignIn