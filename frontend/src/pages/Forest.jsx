import { useState } from "react";
import axios from "axios";

export default function Forest() {
    const [timer, setTimer] = useState(30);
    const [roomId, setRoomId] = useState("");
    const [roomModal, setRoomModal] = useState(false);

    return (
        <div className="relative flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 w-2xl border-2">
            {roomModal && <div className="absolute flex items-center top-0 left-0 w-full bg-gray-600 h-10 px-4">
                <p>Room Code :</p>
                <input type="text" className="mx-4 border" onChange={(e) => setRoomId(e.target.value)}/>
            </div>}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forest</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">Welcome to the Forest page!</p>
            <div className="w-64 h-64 rounded-full my-6 bg-gray-300">

            </div>
            <select onChange={(e) => setTimer(e.target.value)} name="duration" id="duration" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="120">120</option>
            </select>
            <div className="mt-3 flex space-x-4">
                <button className="bg-green-700 px-4 py-1.5 text-white rounded">Create Room</button>
                <button className="bg-gray-700 px-4 py-1 text-white rounded" onClick={(e) => setRoomModal(!roomModal)}>Join Room</button>
            </div>
        </div>
    );
}