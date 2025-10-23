const express = require('express');
const router = express.Router();
const { 
    submitIssue, 
    getAllIssues, 
    getIssueById, 
    updateIssueStatus 
} = require('../Controllers/IssueController');

// Public routes (no authentication required for now)
router.post('/submit', submitIssue);
router.get('/all', getAllIssues);
router.get('/:issueId', getIssueById);

// Protected routes (for admin/worker - will need authentication middleware later)
router.put('/:issueId/status', updateIssueStatus);

module.exports = router;
