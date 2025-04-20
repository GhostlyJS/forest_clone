const sessionController = require('../controllers/session.controller');
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/create', jwtMiddleware, sessionController.createSession);
router.post('/join/:sessionId', jwtMiddleware, sessionController.joinSession);
router.get('/:sessionId', jwtMiddleware, sessionController.getSession);
router.put('/:sessionId', jwtMiddleware, sessionController.updateSession);
router.delete('/:sessionId', jwtMiddleware, sessionController.deleteSession);

module.exports = router;