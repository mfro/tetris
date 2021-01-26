import { URL } from 'url';

import WebSocket from 'ws';

import { Packet, PacketBody, receive, send } from '@mfro/ts-common/sockets/server';

import {
    RoomCode, StartGame,
    GameUpdate, ClientUpdate, BroadcastUpdate, StartGameRequest, RoomState,
} from 'common';

import { on } from '@mfro/ts-common/events';

let port = process.argv[2] ? parseInt(process.argv[2]) : 8081;

interface Client {
    name: string;
    index: number;
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
    let room = { rules: {}, clients: [] };
    rooms.set(code, room);
    return [code, room];
}

server.on('connection', (socket, request) => {
    if (request.url == null)
        return socket.close();

    let url = new URL(request.url, 'tetris:/');
    let code = url.searchParams.get('code');
    let name = url.searchParams.get('name');

    if (name == null) {
        return socket.close();
    }

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

    let client = { index: 0, socket, name };
    room.clients.push(client);
    update();

    socket.on('close', () => {
        let index = room.clients.indexOf(client);
        room.clients.splice(index, 1);
        if (room.clients.length == 0) {
            rooms.delete(code!);
        } else {
            update();
        }
    });

    function update() {
        const names = room.clients.map(c => c.name);
        for (let i = 0; i < room.clients.length; ++i) {
            send(room.clients[i].socket, RoomState, { names, index: i });
        }
    }

    function broadcast<T extends PacketBody>(packet: Packet<T>, value: T, skip?: Client) {
        for (let client of room.clients) {
            if (client != skip) {
                send(client.socket, packet, value);
            }
        }
    }

    on(receive(socket, StartGameRequest), (config) => {
        if (client != room.clients[0]) return;

        for (let i = 0; i < room.clients.length; ++i) {
            room.clients[i].index = i;
        }

        let players = room.clients.length;
        broadcast(StartGame, { ...config, players });
    });

    on(receive(socket, ClientUpdate), (update) => {
        broadcast(BroadcastUpdate, [client.index, update] as [number, GameUpdate], client);
    });
});
