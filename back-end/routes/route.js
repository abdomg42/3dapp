import express from "express";

const route = express.Router();

route.get("/test",(req, res) => {
    res.send('from test k')
})


export default route;