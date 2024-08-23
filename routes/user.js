import { Router } from "express";
import { createUser, editUser, followOrUnfollow, getUser, loginUser, logout } from "../controller/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = Router();

app.get("/login", loginUser)
app.get("/logout",isAuthenticated, logout)
app.get("/:id/me", isAuthenticated, getUser)
app.put("/editprofile", isAuthenticated, editUser)
app.put("/follow", isAuthenticated, followOrUnfollow)
app.post("/register", createUser)

export default app;