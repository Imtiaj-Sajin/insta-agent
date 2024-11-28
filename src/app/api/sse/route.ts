// app/api/sse/route.ts
import { NextRequest, NextResponse } from 'next/server';

let clients: any[] = [];

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  
  // Add this client to the clients array
  clients.push(writer);

  // Set headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // When the client disconnects, remove it from the clients array
  req.signal.addEventListener('abort', () => {
    clients = clients.filter(client => client !== writer);
  });

  return new Response(readable, {
    headers,
  });
}

// Send data to all connected clients
export function sendSSEData(data: any) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    console.log("Broadcasting message to clients:", message);

    if (clients.length === 0) {
        console.warn("No clients connected to receive the message.");
        clients.forEach(client => client.write(message));
    } else {
        clients.forEach(client => client.write(message));
    }
}

