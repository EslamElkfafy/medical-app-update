"use server";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";  
export interface TokenData {
  roomId: string;
  userName: string;
  role: string;
} const secret = process.env.HMS_SECRET;
  const apiKey = process.env.NEXT_PUBLIC_HMS_API_KEY;
export async function generateSecureToken(data: TokenData) {
  const { roomId, userName, role } = data;
 
  if (!secret || !apiKey) {
    return { error: "Missing HMS API credentials", status: 500, token: null };
  }
  try {
    const token = jwt.sign(
      {
        access_key: apiKey,
        room_id: roomId,
        user_id: userName,
        role: role,
        type: "app",
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      { algorithm: "HS256", expiresIn: "1h" }
    );
    return { error: null, status: 200, token };
  } catch (error) {
    return { error: "Failed to generate token", status: 500, token: null };
  }
}
export  async function createRoom(roomName: string) {

  if(!secret|| !apiKey){
    return { error: "Missing HMS API credentials", status: 500, roomId: null };
  }
  try {
    const token = jwt.sign(
      {
        access_key: apiKey,
        type: "management",
        jti: uuidv4(),
      },
      secret,
      { algorithm: "HS256", expiresIn: "1h" }
    )
    const response = await fetch("https://api.100ms.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        description: "Doctor-patient Appointment Room",
        template_id: "67c951e28102660b706b0100",
      }),
    });
    const roomData = await response.json();
    if (response.ok) {
        return { error: null, status: 200, roomId: roomData.id };
    } else {
        return { error: roomData, status: 500, roomId: null };
    }
  } catch (error) {
    return { error: "Failed to create room", status: 500, roomId: null };
  }
}
