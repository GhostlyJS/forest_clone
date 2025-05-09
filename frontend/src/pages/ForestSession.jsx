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
    const [users, setUsers] = useState([]);
    const [progress, setProgress] = useState(0);

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
                setTempTiming(res.data.time);
                console.log(res.data.userId);
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

            socket.on("userConnect", (user) => {
                setUsers(user);
            });

            socket.on("userNotAllowed", () => {
                window.location.href = "/forest";
            })
            socket.on("sessionStarted", (time) => {
                setIsStarted(true);
                setTempTiming(time);
            });
            socket.on("sessionTimer", (time, percentage) => {
                setTiming(time);
                setProgress(percentage);            
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
    
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Modern Clipboard API
            navigator.clipboard.writeText(sessionId)
                .then(() => alert("Session ID copied to clipboard!"))
                .catch((err) => alert("Failed to copy Session ID: " + err));
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = sessionId;
            textArea.style.position = "fixed"; // Avoid scrolling to bottom
            textArea.style.opacity = "0"; // Hide the textarea
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
    
            try {
                const successful = document.execCommand("copy");
                if (successful) {
                    alert("Session ID copied to clipboard!");
                } else {
                    alert("Failed to copy Session ID.");
                }
            } catch (err) {
                alert("Failed to copy Session ID: " + err);
            }
    
            document.body.removeChild(textArea);
        }
    }

    const keyframesStyle = `

    @keyframes spin-full {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes spin-full-reverse {
        from {
            transform: rotate(360deg);
        }
        to {
            transform: rotate(0deg);
        }
    }
  `;

    return (
        <div className="relative flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 w-2xl border-2">
            <div className="flex mb-4 gap-3 items-center justify-center">
                {users.map((user, index) => (
                    <div key={index} className={`w-12 h-12 rounded-full ${colors[index % colors.length]} flex items-center justify-center`}>
                        <img src={"http://176.133.252.124:5000/"+user.profilePicture} alt="User" className="w-full h-full rounded-full" />
                    </div>
                ))}
            </div>
            <h1 className="text-3xl font-bold text-white">Forest</h1>
            <p className="text-lg text-gray-300">Welcome to the Forest session !</p>
            {isStarted && <div className="w-64 h-64 rounded-full my-6 bg-gray-300">
                <style>{keyframesStyle}</style>
                <div className="relative w-full h-full margin-auto overflow-hidden rounded-full">
                    <div className="absolute left-[-25%] bg-[#33cfff] opacity-40 w-[200%] h-[200%] rounded-[40%]" style={{ animation: "spin-full 4s linear infinite" , top: `${progress + 10}%`}}>

                    </div>
                    <div className="absolute left-[-25%] bg-[#0eaffe] opacity-35 w-[200%] h-[200%] rounded-[35%]" style={{ animation: "spin-full 7s linear infinite" , top: `${progress + 5}%`}}>

                    </div>
                    <div className="absolute left-[-25%] bg-[#0f7ae4] opacity-30 w-[200%] h-[200%] rounded-[33%]" style={{ animation: "spin-full 10s linear infinite", top: `${progress}%` }}>

                    </div>
                </div>
            </div>}
            {!isStarted && <div className="w-64 h-64 rounded-full my-6 bg-gray-300"></div>}
            <span className="text-lg text-gray-300" onClick={(e) => copySessionId(e)}>
                Session : {sessionId}
            </span>
            {!isStarted && <p className="text-white text-2xl font-semibold">{tempTiming}:00</p>}
            {!isStarted && <button className="mt-4 bg-gray-700 px-4 py-1.5 text-white rounded" onClick={startSession}>Start the session</button>}
            {isStarted && <p className="text-white text-2xl font-semibold">{timing}</p>}
        </div>
    );
}