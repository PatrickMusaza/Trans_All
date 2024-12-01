import React from 'react';
import Form from '../../designs/Authentication/Form';
import "./Style.css"

const SignUp = () => {
    return (

        <div className="sign-in-container">
            <div className="left-section">
                <h1>Sign Up to Continue with TransConnect</h1>
                <p>
                    If you already have an account
                    <a href="/sign-in" className="register-link"> Sign In here!</a>
                </p>
            </div>
            <div className="right-section">
                <Form route="api/user/register/" method="register"/>
            </div>
        </div>

    )
}

export default SignUp