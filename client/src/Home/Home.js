import React, { useEffect, useState } from 'react';

function Home() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Spring Boot의 /OspreyAI/api/home 엔드포인트로 요청
        fetch("http://localhost:8888/OspreyAI/api/home")
            .then(response => response.json())  // JSON 형식으로 응답 처리
            .then(data => setMessage(data.message))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default Home;
