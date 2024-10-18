import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectClients {
  [id: string]: Socket;
}
@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectClients = {};
  // cuando un cliente se conecta
  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }
  // cuando un cliente se desconecta
  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }
  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}
