import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { socket } from "../socket";

export default function ForestSession() {
    const { sessionId } = useParams();
    const [isStarted, setIsStarted] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [tempTiming, setTempTiming] = useState(0);
    const [timing, setTiming] = useState("00:00");
    const [userAmount, setUserAmount] = useState(0);

    const colors = [
        "bg-sky-300",
        "bg-purple-300",
        "bg-lime-300",
        "bg-indigo-300",
        "bg-pink-300",
        "bg-amber-300",
        "bg-orange-300",
    ];

    useEffect(() => {
        axios.get(`http://176.133.252.124:5000/api/sessions/${sessionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data);
                setTempTiming(res.data.time);
                setUserAmount(res.data.userId.length);
                if (res.data.status === "started") {
                    setIsStarted(true);
                }
                if (res.data.status === "done") {
                    setIsEnded(true);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [sessionId]);

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("connectToRoom", sessionId, localStorage.getItem("token"));

            socket.on("userConnect", (userAmount) => {
                setUserAmount(userAmount);
                console.log(userAmount);
            });

            socket.on("userNotAllowed", () => {
                window.location.href = "/forest";
            })
            socket.on("sessionStarted", (time) => {
                setIsStarted(true);
                setTempTiming(time);
            });
            socket.on("sessionTimer", (time) => {
                setTiming(time);
            });
            socket.on("sessionEnded", (sessionId) => {
                setIsEnded(true);
                setIsStarted(false);
                window.location.href = "/forest";
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [sessionId]);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/login";
        }
    }, []);

    function startSession() {
        socket.emit("startSession", sessionId);
    }

    function copySessionId(e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(sessionId).then(() => {
            alert("Session ID copied to clipboard !");
        }).catch(err => {
            console.error("Failed to copy session ID: ", err);
        });
    }


    return (
        <div className="relative flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 w-2xl border-2">
            <div className="flex mb-4 gap-3 items-center justify-center">
                {Array.from({length: userAmount}, (_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full ${colors[i % colors.length]}`}></div>
                ))}
            </div>
            <h1 className="text-3xl font-bold text-white">Forest</h1>
            <p className="text-lg text-gray-300">Welcome to the Forest session !</p>
            <div className="w-64 h-64 rounded-full my-6 bg-gray-300">

            </div>
            <p className="text-lg text-gray-300" onClick={copySessionId}>
                Session : {sessionId}
            </p>
            {!isStarted && <p className="text-white text-2xl font-semibold">{tempTiming}:00</p>}
            {!isStarted && <button className="mt-4 bg-gray-700 px-4 py-1.5 text-white rounded" onClick={startSession}>Start the session</button>}
            {isStarted && <p className="text-white text-2xl font-semibold">{timing}</p>}
        </div>
    );
}