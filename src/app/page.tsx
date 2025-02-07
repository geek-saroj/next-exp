// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import LocationPage from "./components/getlocation";
// import VideoCallApp from "./components/camera";

// const App: React.FC = () => {
//   // const socket: Socket = useMemo(
//   //   () =>
//   //     io("http://localhost:3001", {
//   //       withCredentials: true,
//   //     }),
//   //   []
//   // );
// const users = [{name: "saroj", id: 1}, {name: "saroj2", id: 2},{name:"saroj3",id:3}];

// const socket = io("http://localhost:3001")
//   const [messages, setMessages] = useState<string[]>([]);
//   const [message, setMessage] = useState<string>("");
//   const [room, setRoom] = useState<string>("");
//   const [socketID, setSocketId] = useState<string>("");
//   const [roomName, setRoomName] = useState<string>("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     socket.emit("message", { message, room });
//     setMessage("");
//   };
//   useEffect(() => {
//     socket.emit("addUser",users[0].id);
//   }, [ socket]);
//   const joinRoomHandler = (e: React.FormEvent) => {
//     e.preventDefault();
//     socket.emit("join-room", roomName);
//     setRoomName("");
//   };

//   useEffect(() => {
//     socket.on("connect", () => {
//       const currentSocketId = socket.id || "";
//       setSocketId(currentSocketId);
//       console.log("connected", currentSocketId);
//     });

//     socket.on("receive-message", (data: string) => {
//       console.log(data);
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     socket.on("welcome", (s: string) => {
//       console.log(s);
//     });

//     // return () => {
//     //   socket.disconnect();
//     // };
//   }, []);

//   console.log("messages", messages);
//   return (
//     <div className="">
//       <div className="">
//         <h2 className="text-xl font-semibold mb-4">Chat Room</h2>
//         <p className="text-sm text-gray-500 mb-4">Socket ID: {socketID}</p>

//         {/* <form onSubmit={joinRoomHandler} className="mb-4">
//           <h5 className="font-medium mb-2">Join Room</h5>
//           <input
//             type="text"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//             className="w-full border border-gray-300 rounded p-2 mb-2"
//             placeholder="Room Name"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//           >
//             Join
//           </button>
//         </form> */}

//         {/* <LocationPage /> */}

//         {/* <div className="overflow-y-auto max-h-60">
//           {messages.map((m, i) => (
//             <div key={i} className="mb-2">
//               <p className="text-gray-800">{m}</p>
//             </div>
//           ))}

//         </div> */}

//         <VideoCallApp />
//       </div>
//     </div>
//   );
// };

// export default App;

import React from "react";
import VideoCallApp from "./components/camera";

function page() {
  return (
    <div>
      <VideoCallApp />
    </div>
  );
}

export default page;
