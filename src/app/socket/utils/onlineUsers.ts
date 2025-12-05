import { TSocket } from "../interface/socket.interface";

const onlineUsers: Record<string, TSocket> = {};

export default onlineUsers;
