import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase/firebase';

function App() {
  const [authorized, setAuthorized] = useState(sessionStorage.getItem('auth') === 'true');
  const [blocked, setBlocked] = useState();
  const [userIds, setuserIds] = useState(sessionStorage.getItem('Id'))
  const navigate = useNavigate();

  const getInfo = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map((doc) => doc.data());
    return usersList;
  }
  const sendToLogin = () => {
    sessionStorage.setItem('auth', false)
    setAuthorized(false)
    navigate('/task4/login')
  }
  const checkAccountExistence = async () => {
    try {
      const userList = await getInfo()
      const userExistense = userList.find(user => user.id === userIds)
      if (userExistense == undefined) {
        sendToLogin()
        return false
      }
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  const checkBlocked = async () => {
    try {
      const usersList = await getInfo()
      const currentUser = usersList.find(user => user.id === userIds)
      if (currentUser.status == 'Blocked') {
        sendToLogin()
        Logout()
      }
    } catch (error) {
      console.log(error);
    }
    return blocked;
  };
  useEffect(() => {
    setBlocked(checkBlocked());
    checkAccountExistence()
    if (authorized == false) {
      sendToLogin()
    }
  }, []);
  const [userName, setUserName] = useState(sessionStorage.getItem('Name'))

  useEffect(() => {
    const handleNavigation = () => {
      if (authorized == false || blocked == true) {
        sendToLogin()
      }
    };

    handleNavigation();
  }, [authorized, blocked, navigate]);

  const Logout = () => {
    sessionStorage.setItem('auth', false);
    sessionStorage.removeItem('Id')
    window.location.reload();
    setAuthorized(false);
  }


  return (
    <>
        <div className='r-button'>
          {authorized ? (
            <div className='r-button-content'>
              <span>Hello, {userName}!</span>
              <button className='btn-logout' onClick={Logout}>Logout</button>
            </div>
          ) : (
            <span>Login</span>
          )}
        </div>
      <div className='maincontainer'>
        <Outlet />
      </div>
    </>
  )
}

export default App;
