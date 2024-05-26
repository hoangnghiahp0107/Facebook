import express from 'express';
import postRoutes from './postRoutes.js';
import userRoutes from './userRoutes.js';


const rootRouter = express.Router();

rootRouter.use("/posts",[postRoutes]);
rootRouter.use("/users",[userRoutes]);

export default rootRouter;
