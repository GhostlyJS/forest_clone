const sessionSchema = require('../models/session.model');
const Tree = require('../models/tree.model');

module.exports = {
    async createSession(req, res) {
        try {
            const { treeId, duration } = req.body;
            const userId = req.user.id; // Assuming you have user ID from the request context
            /* const tree = await Tree.findById(treeId);
            if (!tree) {
                return res.status(404).json({ message: 'Tree not found' });
            } */
            const session = new sessionSchema({
                userId: [userId],
                status: 'not-started',
                time: duration,
            });
            await session.save();
            res.status(201).json({ message: 'Session created successfully', session });
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getSession(req, res) {
        try {
            const { sessionId } = req.params;
            const sessions = await sessionSchema.findOne({ _id : sessionId }).populate('tree');
            res.status(200).json(sessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async joinSession(req, res) {
        try {
            const { sessionId } = req.params;
            const userId = req.user.id; // Assuming you have user ID from the request context
            const session = await sessionSchema.findById(sessionId);
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            if (session.userId.includes(userId)) {
                return res.status(400).json({ message: 'User already in session' });
            }
            session.userId.push(userId);
            await session.save();
            res.status(200).json({ message: 'Joined session successfully', session });
        } catch (error) {
            console.error('Error joining session:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async updateSession(req, res) {
        try {
            const { sessionId } = req.params;
            const { status } = req.body;
            const session = await sessionSchema.findById(sessionId);
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            session.status = status;
            await session.save();
            res.status(200).json({ message: 'Session updated successfully', session });
        } catch (error) {
            console.error('Error updating session:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async deleteSession(req, res) {
        try {
            const { sessionId } = req.params;
            const session = await sessionSchema.findByIdAndDelete(sessionId);
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            res.status(200).json({ message: 'Session deleted successfully' });
        } catch (error) {
            console.error('Error deleting session:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}