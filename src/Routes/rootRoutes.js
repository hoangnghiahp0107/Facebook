import express from 'express';
import postRoutes from './postRoutes.js';
import userRoutes from './userRoutes.js';
import chatRoutes from './chatRoutes.js';
import notificationsRoutes from './notificationsRoute.js';
import storyRoutes from './storyRoutes.js';
import friendRoutes from './friendRoutes.js';


const rootRouter = express.Router();

rootRouter.use("/posts",[postRoutes]);
rootRouter.use("/users",[userRoutes]);
rootRouter.use("/chats",[chatRoutes])
rootRouter.use("/notification",[notificationsRoutes]);
rootRouter.use("/storys", [storyRoutes]);
rootRouter.use("/friends",[friendRoutes]);

export default rootRouter;
