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

    useEffect(() => {
        axios.get(`http://localhost:5000/api/sessions/${sessionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data);
                setTempTiming(res.data.time);
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

    function startSession() {
        socket.emit("startSession", sessionId);
    }

    return (
        <div className="relative flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 w-2xl border-2">
            <h1 className="text-3xl font-bold text-white">Forest</h1>
            <p className="text-lg text-gray-300">Welcome to the Forest page!</p>
            <div className="w-64 h-64 rounded-full my-6 bg-gray-300">

            </div>
            <p className="text-lg text-gray-300">
                Session : {sessionId}
            </p>
            {!isStarted && <p className="text-white text-2xl font-semibold">{tempTiming}:00</p>}
            {!isStarted && <button className="mt-4 bg-gray-700 px-4 py-1.5 text-white rounded" onClick={startSession}>Start the session</button>}
            {isStarted && <p className="text-white text-2xl font-semibold">{timing}</p>}
        </div>
    );
}