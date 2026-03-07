const express = require("express");
const { register, login, getAllUsers } = require("../controllers/UserController");
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/admin/all', authenticate, authorize('admin'), getAllUsers);

module.exports = router;
