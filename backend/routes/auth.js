import express from "express";
import passport from "../config/passport.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();


/*
-----------------------------------------
1. START GOOGLE LOGIN
-----------------------------------------
*/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


/*
-----------------------------------------
2. GOOGLE CALLBACK
-----------------------------------------
*/

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),

  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);


/*
-----------------------------------------
3. CURRENT USER
-----------------------------------------
*/

router.get("/me", isAuthenticated, (req, res) => {

  res.json({
    success: true,
    user: req.user.toPublicProfile(),
  });

});


/*
-----------------------------------------
4. LOGOUT
-----------------------------------------
*/

router.post("/logout", (req, res, next) => {

  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {

      res.clearCookie("connect.sid", {
        path: "/",
      });

      res.json({
        success: true,
        message: "Logged out successfully",
      });

    });

  });

});

export default router;