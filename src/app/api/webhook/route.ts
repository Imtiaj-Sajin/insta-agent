//app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Server } from 'socket.io';
import { createServer } from 'http';
import io from 'socket.io-client'

// Connect to the WebSocket server

let socket: any;

function initializeSocket() {
  if (!socket || !socket.connected) {
    socket = io('https://nkf448kn-4000.asse.devtunnels.ms');
    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('disconnect', () => console.log('Socket disconnected'));
  }
}


const VERIFY_TOKEN = 'v_token'; // Store in .env.local
const APP_SECRET = process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET || ''; // Store in .env.local

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const mode = searchParams.get('hub.mode');
      const token = searchParams.get('hub.verify_token');
      const challenge = searchParams.get('hub.challenge');
      const headers = req.headers; // Log headers to see if anything is missing
      
      console.log('Received GET Request:');
      console.log('Mode:', mode);
      console.log('Token:', token);
      console.log('Challenge:', challenge);
      console.log('Expected VERIFY_TOKEN:', VERIFY_TOKEN);
      console.log('Request Headers:', headers);
  
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified');
        return new Response(challenge, { status: 200 });
      } else {
        console.error('Verification failed');
        return new Response('Forbidden', { status: 403 });
      }
    } catch (error) {
      console.error('Error in GET verification:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  

// Handle POST requests for Webhook Notifications
export async function POST(req: NextRequest) {
    try {
      const body = await req.text(); // Capture raw body
      const signature = req.headers.get('x-hub-signature-256') || ''; // Get Meta signature header
  
      console.log('Received POST Request:');
      console.log('Body:', body);
      console.log('Signature:', signature);
  
      // Verify the payload signature
      if (!verifySignature(body, signature)) {
        console.error('Signature verification failed');
        return new Response('Forbidden', { status: 403 });
      }
  
      // Parse the payload
      const payload = JSON.parse(body);
      console.log('Parsed Payload:', payload);
      initializeSocket();
      try{
        socket.emit('webhook-event', payload);
        console.log('Payload emitted to socket');
      } catch (err) {
          console.error('Error emitting to socket:', err);
      }
      // Check if this is a message notification
      if (payload.object === 'page') {
        payload.entry.forEach((entry: any) => {
          entry.messaging?.forEach((event: any) => {
            if (event.message) {
              console.log('Message Event:', event);
              handleMessage(event); // Custom function to handle messages
            } else if (event.postback) {
              console.log('Postback Event:', event);
              handlePostback(event); // Custom function to handle postbacks
            }
          });
        });

        return new Response('EVENT_RECEIVED', { status: 200 });
      } else {
        console.warn('Unsupported Event:', payload);
        return new Response('Unsupported Event', { status: 404 });
      }
    } catch (error) {
      console.error('Error Handling POST Request:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  


function verifySignature(payload: string, signature: string): boolean {
    const hash = crypto.createHmac('sha256', APP_SECRET).update(payload).digest('hex');
    const expectedSignature = `sha256=${hash}`;
    
    // Debugging: Log the calculated hash and incoming signature
    console.log('Calculated Signature:', expectedSignature);
    console.log('Received Signature:', signature);
    
    return expectedSignature === signature;
  }
  

// Handle Incoming Messages
function handleMessage(event: any) {
  const senderId = event.sender.id;
  const message = event.message.text;

  console.log(`Received message from ${senderId}: ${message}`);
  // Add your logic here to process or respond to the message
}

// Handle Postbacks
function handlePostback(event: any) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  console.log(`Received postback from ${senderId}: ${payload}`);
  // Add your logic here to process the postback
}
