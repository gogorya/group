import { io } from "socket.io-client";

import { host } from "./pages/apiRoutes";

export const socket = io(host);
