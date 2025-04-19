import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { socket } from "../socket";

export default function ForestSession() {
    const { sessionId } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/sessions/${sessionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [sessionId]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            socket.emit("connectToRoom", sessionId, localStorage.getItem("token"));
            socket.on("userNotAllowed", () => {
                window.location.href = "/forest";
            })
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();
        };
    }, [sessionId]);

    return (
        <div className="relative flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 w-2xl border-2">
            <h1 className="text-3xl font-bold text-white">Forest</h1>
            <p className="text-lg text-gray-300">Welcome to the Forest page!</p>
            <div className="w-64 h-64 rounded-full my-6 bg-gray-300">

            </div>
            <p className="text-lg text-gray-300">
                Session : {sessionId}
            </p>
        </div>
    );
}