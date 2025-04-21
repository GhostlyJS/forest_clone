import { useEffect, useState } from "react";
import axios from "axios";

export default function Forest() {
    const [timer, setTimer] = useState(30);
    const [roomId, setRoomId] = useState("");
    const [roomModal, setRoomModal] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/login";
            return;
        }
        axios.get("http://176.133.252.124:5000/api/users/getuser", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function createSession() {
        axios.post("http://176.133.252.124:5000/api/sessions/create",
            { duration: timer },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
            .then((res) => {
                if (res.status === 201) {
                    window.location.href = `/forest/${res.data.session._id}`;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function joinSession() {
        axios.post(`http://176.133.252.124:5000/api/sessions/join/${roomId}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = `/forest/${roomId}`;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="relative flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-900 w-2xl border-2">
            {roomModal && <div className="absolute flex items-center top-0 left-0 w-full bg-gray-600 h-10 px-4">
                <p>Room Code :</p>
                <input type="text" className="mx-4 border" onChange={(e) => setRoomId(e.target.value)}/>
                <button onClick={joinSession} className="bg-gray-700 px-4 py-1.5 text-white rounded">Join Room</button>
            </div>}
            <div className="absolute flex items-center top-6 right-6 w-12 h-12">
                <img src={"http://176.133.252.124:5000/profilepicture/"+user.profilePicture} alt="Profile" className="h-full w-full rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-white">Forest</h1>
            <p className="text-lg text-gray-300">Welcome to the Forest page!</p>
            <div className="w-64 h-64 rounded-full my-6 bg-gray-300">

            </div>
            <select onChange={(e) => setTimer(e.target.value)} name="duration" id="duration" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="120">120</option>
            </select>
            <div className="mt-3 flex space-x-4">
                <button className="bg-green-700 px-4 py-1.5 text-white rounded" onClick={(e) => createSession()} >Create Room</button>
                <button className="bg-gray-700 px-4 py-1.5 text-white rounded" onClick={(e) => setRoomModal(!roomModal)}>Join Room</button>
            </div>
        </div>
    );
}