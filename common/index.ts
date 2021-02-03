import { Packet } from '@mfro/ts-common/sockets/client';

export const RoomCode = Packet.define<string>();
export const RoomState = Packet.define<{ index: number, names: string[] }>();

export const StartGameRequest = Packet.define<{ seed: number, rules: any }>();
export const StartGame = Packet.define<{ seed: number, rules: any, players: number }>();

export type GameUpdate =
  | { type: 'hold' }
  | { type: 'drop', distance: number }
  | { type: 'shift', dir: 1 | -1 }
  | { type: 'rotate', dir: 1 | -1 }
  | { type: 'lock_down' }
  | { type: 'send_lines', count: number }
  | { type: 'apply_garbage' }
  | { type: 'new_falling' }
  | { type: 'end_game' }

export const ClientUpdate = Packet.define<GameUpdate>();
export const BroadcastUpdate = Packet.define<[number, GameUpdate]>();
