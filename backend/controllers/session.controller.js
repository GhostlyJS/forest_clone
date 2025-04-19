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
            const userId = req.user._id; // Assuming you have user ID from the request context
            const { sessionId } = req.params;
            const sessions = await sessionSchema.findOne({ userId }).populate('tree');
            res.status(200).json(sessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
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