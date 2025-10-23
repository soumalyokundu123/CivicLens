const IssueModel = require('../Models/Issue');

// Generate unique issue ID
const generateIssueId = () => {
    const prefix = 'CIV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
};

// Submit a new issue
const submitIssue = async (req, res) => {
    try {
        const { title, description, category, location, coordinates, images } = req.body;

        // Validate required fields
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and category are required fields'
            });
        }

        // Generate unique issue ID
        let issueId;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            issueId = generateIssueId();
            const existingIssue = await IssueModel.findOne({ issueId });
            if (!existingIssue) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            return res.status(500).json({
                success: false,
                message: 'Unable to generate unique issue ID. Please try again.'
            });
        }

        // Parse coordinates if provided
        let parsedCoordinates = null;
        if (coordinates && coordinates.lat && coordinates.lng) {
            parsedCoordinates = {
                lat: parseFloat(coordinates.lat),
                lng: parseFloat(coordinates.lng)
            };
        }

        // Create new issue
        const newIssue = new IssueModel({
            title: title.trim(),
            description: description.trim(),
            category,
            location: location || '',
            coordinates: parsedCoordinates,
            images: images || [],
            issueId,
            status: 'pending',
            priority: 'medium'
        });

        // Save to database
        const savedIssue = await newIssue.save();

        res.status(201).json({
            success: true,
            message: 'Issue submitted successfully',
            data: {
                issueId: savedIssue.issueId,
                title: savedIssue.title,
                status: savedIssue.status,
                submittedAt: savedIssue.submittedAt
            }
        });

    } catch (error) {
        console.error('Error submitting issue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all issues (for admin/worker view)
const getAllIssues = async (req, res) => {
    try {
        const { status, category, priority, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get issues with pagination
        const issues = await IssueModel.find(filter)
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email');

        // Get total count for pagination
        const totalIssues = await IssueModel.countDocuments(filter);
        const totalPages = Math.ceil(totalIssues / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                issues,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalIssues,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get issue by ID
const getIssueById = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await IssueModel.findOne({ issueId })
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .populate('comments.author', 'name email');

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        res.status(200).json({
            success: true,
            data: issue
        });

    } catch (error) {
        console.error('Error fetching issue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update issue status (for admin/worker)
const updateIssueStatus = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { status, priority, assignedTo, comment } = req.body;

        const issue = await IssueModel.findOne({ issueId });

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'Issue not found'
            });
        }

        // Update fields if provided
        if (status) issue.status = status;
        if (priority) issue.priority = priority;
        if (assignedTo) issue.assignedTo = assignedTo;
        
        // Set resolved date if status is resolved
        if (status === 'resolved') {
            issue.resolvedAt = new Date();
        }

        // Add comment if provided
        if (comment && req.user) {
            issue.comments.push({
                text: comment,
                author: req.user.id,
                createdAt: new Date()
            });
        }

        const updatedIssue = await issue.save();

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            data: updatedIssue
        });

    } catch (error) {
        console.error('Error updating issue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    submitIssue,
    getAllIssues,
    getIssueById,
    updateIssueStatus
};
