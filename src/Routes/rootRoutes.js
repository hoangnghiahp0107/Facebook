import express from 'express';
import postRoutes from './postRoutes.js';
import userRoutes from './userRoutes.js';
import chatRoutes from './chatRoutes.js';
import notificationsRoutes from './notificationsRoute.js';


const rootRouter = express.Router();

rootRouter.use("/posts",[postRoutes]);
rootRouter.use("/users",[userRoutes]);
rootRouter.use("/chats",[chatRoutes])
rootRouter.use("/notification",[notificationsRoutes]);

export default rootRouter;
