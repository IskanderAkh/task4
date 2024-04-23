import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, setDoc, updateDoc, doc, query, where, onSnapshot, deleteDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { db } from '../firebase/firebase';
import block_icon from '../assets/imgs/block.svg';
import unlock_icon from '../assets/imgs/unlock.svg';
import delete_icon from '../assets/imgs/delete.svg';
import expand_icon from '../assets/imgs/expand.svg';
import { useNavigate } from 'react-router-dom';
const Users = () => {
    const [authorized, setAuthorized] = useState(sessionStorage.getItem('auth') === 'true');
    const [users, setUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState(users);
    const [sortingDirection, setSortingDirection] = useState('asc');
    const [selectedUserIds, setSelectedUserIds] = useState([])
    const checkboxesRef = useRef([]);

    const untickAllCheckboxes = () => {
        checkboxesRef.current.forEach((checkbox) => {
            checkbox.checked = false;
        });
        setSelectedUserIds([]);
    };
    const handleNavigation = () => {
        if (checkAuth()) {
            useNavigate('/task4/users');
        } else {
            useNavigate('/task4/login');
        }
    }

    useEffect(() => {
        if (!authorized) {
            handleNavigation();
        }
    }, [authorized]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userData = [];
                querySnapshot.forEach((doc) => {
                    userData.push({ id: doc.id, ...doc.data() });
                    setSortedUsers(userData.sort((a, b) => a.name.localeCompare(b.name)))
                });
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();


        return () => {

        };
    }, []);
    const sortBytNameChangeHandler = () => {
        const isAscending = sortingDirection === 'desc';
        const sortedUsersCopy = [...sortedUsers];
        const sortedUsersUpdated = sortedUsersCopy.sort((a, b) => {
            if (isAscending) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setSortingDirection(isAscending ? 'asc' : 'desc');
        setSortedUsers(sortedUsersUpdated);

    };

    const handleCheckboxChange = (userId) => {
        setSelectedUserIds(prevIds => {
            if (prevIds.includes(userId)) {
                return prevIds.filter(id => id !== userId);
            } else {
                return [...prevIds, userId];
            }
        });
    };
    const handleBlockUsers = async () => {
        try {
            selectedUserIds.forEach(async (userId) => {
                const userRef = doc(db, "users", userId);

                await setDoc(userRef, { status: 'Blocked' }, { merge: true });
            });
            console.log("Users blocked successfully!");
        } catch (error) {
            console.error("Error blocking users: ", error);
        }
    };
    const deleteUser = async () => {
        try {
            selectedUserIds.forEach(async (userId) => {
                const userRef = doc(db, "users", userId);
                await deleteDoc(userRef)
            })
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        catch (e) {
            console.log(e);
        }
    }
    
    const handleBlockOrUnlockUsers = async (status) => {
        try {
            if (status === 'Active') {
                selectedUserIds.forEach(async (userId) => {
                    const userRef = doc(db, "users", userId);
                    await setDoc(userRef, { status: `${status}` }, { merge: true });
                });
                alert("Users Activated successfully!");
            } else if (status === 'Blocked') {
                selectedUserIds.forEach(async (userId) => {
                    const userRef = doc(db, "users", userId);

                    await setDoc(userRef, { status: `${status}` }, { merge: true });
                });
                alert("Users blocked successfully!");
            }

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='users'>
            <h2>User List</h2>
            <table className='table'>
                <div className='users-tools'>
                    <button onClick={() => handleBlockOrUnlockUsers('Blocked')}><img src={block_icon} alt="" />Block</button>
                    <button onClick={() => handleBlockOrUnlockUsers('Active')}><img src={unlock_icon} alt="" /></button>
                    <button onClick={deleteUser}><img src={delete_icon} alt="" /></button>
                </div>
                <thead className='table-header'>
                    <tr className='table-header-row'>
                        <th className='untick-all'><button onClick={untickAllCheckboxes} className='untick-all-button'>-</button></th>
                        <button onClick={sortBytNameChangeHandler} >Name <img src={expand_icon} alt="" /></button>
                        <th>Email</th>
                        <th>Last Login</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {sortedUsers.map((user, index) => (
                        <tr key={user.id} className='table-body-users'>
                            <td><input type="checkbox" name="checkbox" ref={(el) => (checkboxesRef.current[index] = el)} onChange={() => handleCheckboxChange(user.id, index)} /></td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.lastlogin.seconds * 1000).toLocaleString()}</td>
                            <td>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
