import React, { useState } from 'react';
import { addDoc, collection, getDocs, query, Timestamp, where, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';


const Register = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => doc.data());
        const foundUser = usersList.find(user => user.email === email ? true : false);
        if(foundUser){
            alert('Email already exists!')
            return
        }
        // Handle form submission logic here
        if (password !== confirmPassword) {
            alert('Passwords do not match!')
            return
        }

        const emailQuery = query(
            collection(db, "users"),
            where("email", "==", email)
        );
        const querySnapshot = await getDocs(emailQuery);
        if (querySnapshot.size > 0) {
            alert('Email already exists!')
            return
        }

        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const hashedPassword = hashHex;

        const docRef = await addDoc(collection(db, "users"), {
            name: name,
            email: email,
            password: hashedPassword,
            lastlogin: Timestamp.now(),
            status: "Active",

        });
        await setDoc(docRef, { id: docRef.id }, { merge: true });

        if (docRef.id) {

            console.log('Registration successful');
            onSuccess = true
            window.location.reload()
        } else {
            console.log('Registration failed');
        }
    };
    return (
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='register-button' type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
