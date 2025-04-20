import {io} from 'socket.io-client';

const URL = 'http://176.133.252.124:5000';

export const socket = io(URL);

