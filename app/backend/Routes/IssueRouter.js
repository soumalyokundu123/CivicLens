const express = require('express');
const router = express.Router();
const { 
    submitIssue, 
    getAllIssues, 
    getIssueById, 
    updateIssueStatus,
    ingestCivicLensReport,
    getIssueStats,
    getAnalytics
} = require('../Controllers/IssueController');

// Public routes (no authentication required for now)
router.post('/submit', submitIssue);
router.get('/all', getAllIssues);
router.post('/ingest', ingestCivicLensReport);
router.get('/stats', getIssueStats);
router.get('/analytics', getAnalytics);

// Place param route last so it doesn't catch /stats or /analytics
router.get('/:issueId', getIssueById);

// Protected routes (for admin/worker - will need authentication middleware later)
router.put('/:issueId/status', updateIssueStatus);

module.exports = router;
