"use client";
import { generateSecureToken, TokenData } from "@/actions/hms";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
  selectPeers,
  useVideo,
} from "@100mslive/react-sdk";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMonitor, FiLogOut } from "react-icons/fi";

function Peer({ peer }: { peer: any }) {
  const { videoRef } = useVideo({ trackId: peer.videoTrack });
  return (
    <div className="relative flex flex-col items-center bg-gray-800 p-2 rounded-lg shadow-lg">
      <video
        ref={videoRef}
        className={`w-full h-40 rounded-lg object-cover ${peer.isLocal ? "border-2 border-blue-500" : ""}`}
        autoPlay
        muted={peer.isLocal}
        playsInline
      />
      <div className="mt-2 text-white font-medium">{peer.name} {peer.isLocal ? "(You)" : ""}</div>
    </div>
  );
}

export default function MeetingPage({ roomId, session }: { roomId: string; session: Session }) {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const user = session.user;
  const role = user.role;
  const username = role === "DOCTOR" ? `Dr. ${user.name?.split(" ")[0]}` : user.name?.split(" ")[0];

  useEffect(() => {
    const getToken = async () => {
      const tokenData: TokenData = {
        roomId,
        userName: username || "",
        role: role === "DOCTOR" ? "host" : "guest",
      };
      const data = await generateSecureToken(tokenData);
      if (data.token) setToken(data.token);
    };
    getToken();
  }, [roomId]);

  useEffect(() => {
    const joinRoom = async () => {
      if (!isConnected && token) {
        await hmsActions.join({ authToken: token, userName: username || "" });
      }
    };
    joinRoom();
  }, [token, isConnected, hmsActions]);

  const toggleMic = async () => {
    await hmsActions.setLocalAudioEnabled(!isMicOn);
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!isVideoOn);
    setIsVideoOn(!isVideoOn);
  };

  const leaveRoom = async () => {
    await hmsActions.leave();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      {isConnected ? (
        <div className="w-full max-w-5xl">
          <h2 className="text-lg font-semibold text-center mb-4">Video Call: Room {roomId}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {peers.map(peer => (
              <Peer key={peer.id} peer={peer} />
            ))}
          </div>
          <div className="flex justify-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-lg">
            <button onClick={toggleMic} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">
              {isMicOn ? <FiMic className="w-6 h-6" /> : <FiMicOff className="w-6 h-6" />}
            </button>
            <button onClick={toggleVideo} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full">
              {isVideoOn ? <FiVideo className="w-6 h-6" /> : <FiVideoOff className="w-6 h-6" />}
            </button>
            <button onClick={leaveRoom} className="p-3 bg-red-600 hover:bg-red-500 rounded-full">
              <FiLogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg">Connecting to the meeting room...</p>
      )}
    </div>
  );
}