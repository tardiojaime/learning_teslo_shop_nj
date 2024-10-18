import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

// para obtener informacion del usuario conectado y desconectado
// implementar las siguientes interfaces
@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    // emitimos un evento en el canal cliente-updated
    this.wss.emit(
      'Cliente-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'Cliente-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  //message-from-client
  @SubscribeMessage('message-from-client')
  // Aca tenemos acceso al cliente
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);
  }
}
