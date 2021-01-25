import { URL } from 'url';

import WebSocket from 'ws';

import { Packet, send } from '@mfro/ts-common/sockets/server';
import { RoomCode } from '@mfro/tetris-common';

let port = process.argv[2] ? parseInt(process.argv[2]) : 8081;

interface Client {
    socket: WebSocket;
}

interface Room {
    clients: Client[];
}

const rooms = new Map<string, Room>();

const server = new WebSocket.Server({
    port,
});

function new_room(): [string, Room] {
    let code = Math.floor(Math.random() * 0x1000000).toString(16);
    let room = { clients: [] };
    rooms.set(code, room);
    return [code, room];
}

server.on('connection', (socket, request) => {
    if (request.url == null)
        return socket.close();

    let url = new URL(request.url, 'chess:/');
    let code = url.searchParams.get('code');

    let room: Room;
    if (code == null) {
        [code, room] = new_room();
    } else {
        room = rooms.get(code)!;
        if (room == null || room.clients.length == 2) {
            [code, room] = new_room();
        }
    }

    send(socket, RoomCode, code);

    let client = { socket };
    room.clients.push(client);

    socket.on('close', () => {
        let index = room!.clients.indexOf(client);
        room!.clients.splice(index, 1);
        if (room.clients.length == 0) {
            rooms.delete(code!);
        }
    });

    socket.on('message', data => {
        for (let other of room!.clients) {
            if (other == client) continue;

            other.socket.send(data);
        }
    });
});
