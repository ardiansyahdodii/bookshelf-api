import Hapi from '@hapi/hapi'
import { routes } from './routes.js';

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    // server.route({
    //     method: 'GET',
    //     path: '/',
    //     handler: (request, h) => {
    //         return 'Hello World!';
    //     }
    // })

    server.route(routes)

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();