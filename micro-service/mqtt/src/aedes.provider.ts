import * as aedes from 'aedes';
import { createServer } from 'net'
 
export const AedesProvider = {
  provide: 'AedesServer',
  useFactory: () => {
    const server = createServer((aedes as any)().handle);
    server.listen(1883, () => console.log('Aedes server is running on port 1883'));
    return server;
  },
};