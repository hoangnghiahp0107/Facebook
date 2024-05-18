import express from 'express';
import postRoutes from './postRoutes.js';


const rootRouter = express.Router();

rootRouter.use("/posts",[postRoutes]);

export default rootRouter;
