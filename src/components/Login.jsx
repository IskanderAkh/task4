import React, { useState, useEffect } from 'react';
import '../assets/styles/main.scss';
import { Link, Route, Router } from 'react-router-dom';
import Register from './Register';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const Authorization = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationMode, setRegistrationMode] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const history = useNavigate();
    useEffect(() => {
        if (registrationSuccess) {
            setRegistrationMode(false); 
        }
    }, [registrationSuccess]);
    const hashPassword = async (plainPassword) => {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(plainPassword);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };
   
    const handleLogin = async () => {
        try {
            const hashedPassword = await hashPassword(password);
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map((doc) => doc.data());
            const foundUser = usersList.find(user => user.email === email && user.password === hashedPassword);

            console.log(foundUser);
            if (foundUser) {
                const userRef = doc(db, "users", foundUser.id);
                await setDoc(userRef, { status: 'Active' }, { merge: true });
                sessionStorage.setItem('auth', true)
                alert('Login successful!');
                history('/task4/users');
                sessionStorage.setItem('Id', foundUser.id)
                sessionStorage.setItem('Name', foundUser.name)
                
                window.location.reload();
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegistrationMode = () => {
        setRegistrationMode(true);
    };

    const handleLoginMode = () => {
        setRegistrationMode(false);
    };

    return (
        <div className="login-container">
            <header className="login-header">{registrationMode ? 'Register' : 'Login'}</header>
            {registrationMode ? (
                <Register onSuccess={() => setRegistrationSuccess(true)} />
            ) : (
                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">E-mail:</label>
                        <input
                            type="text"
                            id="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="button" className="login-button" onClick={handleLogin}>Login</button>
                </form>
            )}
            <div className="register-link">
                {registrationMode ? (
                    <p>Already have an account? <Link to={'#'} onClick={handleLoginMode}>Login</Link></p>
                ) : (
                    <p>Don't have an account? <Link to="#" onClick={handleRegistrationMode}>Register here</Link></p>
                )}
            </div>
        </div>
    );
};

export default Authorization;
