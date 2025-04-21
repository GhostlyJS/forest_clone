import { useEffect, useState } from "react";
import axios from "axios";

export default function Forest() {
    const [timer, setTimer] = useState(30);
    const [roomId, setRoomId] = useState("");
    const [roomModal, setRoomModal] = useState(false);
    const [user, setUser] = useState({});
    const [modalMenu, setModalMenu] = useState(false);
    const [modalProfilePicture, setModalProfilePicture] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

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

    function uploadProfilePicture(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);
        axios.post("http://176.133.252.124:5000/api/users/updateProfilePicture", formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => {
                if (res.status === 200) {
                    setModalProfilePicture(false);
                    setModalMenu(false);
                    window.location.reload();
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
            {modalMenu && <div className="absolute flex flex-col top-20 right-8 w-fit bg-gray-200 py-1 h-fit px-4">
                <p onClick={(e) => {setModalMenu(false); setModalProfilePicture(true)}}>Change Profile picture</p>         
            </div>}
            {modalProfilePicture && <div className="z-10 fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-gray-200/20 py-1 px-4">
                
                <form onSubmit={uploadProfilePicture} class="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold mb-4">Upload Profile Picture</h2>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload file</label>
                    <div className="flex">
                        <input onChange={(e) => setProfilePicture(e.target.files[0])} class="block w-3/4 text-sm text-gray-900 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file"/>
                        <button type="submit" className="bg-green-600 rounded mx-3 px-3 text-white">Submit</button>
                    </div>
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">A profile picture is useful to confirm your are logged into your account</div>
                </form>

            </div>}
            <div className="absolute flex items-center top-6 right-6 w-12 h-12" onClick={() => setModalMenu(!modalMenu)}>
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