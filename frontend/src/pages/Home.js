import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged Out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchProducts = async () => {
        try {
            const url = 'https://internshipassignment-api.vercel.app/products';
            const headers = {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log(result);
            setProducts(result);
            setFlashcards(result.map((item, index) => ({
                id: index,
                question: `What is the price of ${item.name}?`,
                answer: `The price of ${item.name} is Rs.${item.price}`,
                flipped: false
            })));
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleFlashcard = (id) => {
        setFlashcards(flashcards.map(card =>
            card.id === id ? { ...card, flipped: !card.flipped } : card
        ));
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <h2>Welcome, {loggedInUser}</h2>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>
            <div className="flashcards-container">
                {flashcards.map(card => (
                    <div
                        key={card.id}
                        className={`flashcard ${card.flipped ? 'flipped' : ''}`}
                        onClick={() => toggleFlashcard(card.id)}
                    >
                        <div className="front">
                            {card.question}
                        </div>
                        <div className="back">
                            {card.answer}
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;

