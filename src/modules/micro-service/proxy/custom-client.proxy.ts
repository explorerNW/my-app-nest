import { ClientProxy, ClientTCP, ReadPacket, WritePacket } from "@nestjs/microservices";
import { Observable } from "rxjs";

export class CustomClientProxy extends ClientProxy {
    async connect(): Promise<any> { }
    async close() { }
    async dispatchEvent(packet: ReadPacket<any>): Promise<any> { }
    protected publish(packet: ReadPacket, callback: (packet: WritePacket) => void): () => void {
        callback({ response: packet.data });
        return () => console.log('teardown');
    }
}