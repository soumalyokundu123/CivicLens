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
        const { status, category, priority, assignedTo, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

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

// Get quick stats for admin dashboard
async function getIssueStats(req, res) {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [pending, inProgress, resolvedTodayAgg, avgResolutionAgg] = await Promise.all([
            IssueModel.countDocuments({ status: 'pending' }),
            IssueModel.countDocuments({ status: 'in-progress' }),
            IssueModel.countDocuments({ status: 'resolved', resolvedAt: { $gte: startOfDay } }),
            IssueModel.aggregate([
                { $match: { status: 'resolved', resolvedAt: { $exists: true }, submittedAt: { $exists: true } } },
                { $project: { diffHours: { $divide: [{ $subtract: ['$resolvedAt', '$submittedAt'] }, 1000 * 60 * 60] } } },
                { $group: { _id: null, avgHours: { $avg: '$diffHours' } } }
            ])
        ]);

        const avgHours = (avgResolutionAgg && avgResolutionAgg[0] && avgResolutionAgg[0].avgHours) || null;

        res.status(200).json({
            success: true,
            data: {
                pending,
                inProgress,
                resolvedToday: resolvedTodayAgg,
                avgResolutionHours: avgHours
            }
        });
    } catch (error) {
        console.error('Error computing issue stats:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

// Analytics for charts
async function getAnalytics(req, res) {
    try {
        // Category distribution
        const categories = ['road','infrastructure','public-spaces','public-safety','utilities','other'];
        const categoryCounts = await Promise.all(categories.map(async (c) => ({ name: c, value: await IssueModel.countDocuments({ category: c }) })));

        // Monthly trends (last 6 full months + current)
        const now = new Date();
        const months = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
            months.push({ label: start.toLocaleString('en-US', { month: 'short' }), start, end });
        }
        const monthlyTrend = [];
        for (const m of months) {
            const reported = await IssueModel.countDocuments({ submittedAt: { $gte: m.start, $lt: m.end } });
            const resolved = await IssueModel.countDocuments({ status: 'resolved', resolvedAt: { $gte: m.start, $lt: m.end } });
            monthlyTrend.push({ month: m.label, reported, resolved });
        }

        // Resolution time by category (avg days where resolved)
        const resolutionAgg = await IssueModel.aggregate([
            { $match: { status: 'resolved', resolvedAt: { $exists: true }, submittedAt: { $exists: true } } },
            { $project: { category: 1, diffDays: { $divide: [{ $subtract: ['$resolvedAt', '$submittedAt'] }, 1000 * 60 * 60 * 24] } } },
            { $group: { _id: '$category', avgDays: { $avg: '$diffDays' } } }
        ]);
        const resolutionByCategory = categories.map(c => {
            const row = resolutionAgg.find(r => r._id === c);
            return { category: c, avgDays: row ? Number(row.avgDays.toFixed(1)) : 0 };
        });

        // Totals and resolution rate
        const [totalIssues, resolvedTotal] = await Promise.all([
            IssueModel.countDocuments({}),
            IssueModel.countDocuments({ status: 'resolved' })
        ]);
        const resolutionRate = totalIssues ? Math.round((resolvedTotal / totalIssues) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                categoryDistribution: categoryCounts,
                monthlyTrend,
                resolutionByCategory,
                totals: { totalIssues, resolvedTotal, resolutionRate }
            }
        });
    } catch (error) {
        console.error('Error computing analytics:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

module.exports = {
    submitIssue,
    getAllIssues,
    getIssueById,
    updateIssueStatus,
    ingestCivicLensReport,
    getIssueStats,
    getAnalytics
};

// Helper: map free-form CivicLens category to our enum
function mapCategory(input) {
    if (!input) return 'other';
    const s = input.toLowerCase();
    if (s.includes('road') || s.includes('traffic')) return 'road';
    if (s.includes('safety') || s.includes('crime') || s.includes('security')) return 'public-safety';
    if (s.includes('park') || s.includes('public space') || s.includes('playground')) return 'public-spaces';
    if (s.includes('water') || s.includes('electric') || s.includes('utility') || s.includes('sew')) return 'utilities';
    if (s.includes('infra') || s.includes('bridge') || s.includes('building')) return 'infrastructure';
    return 'other';
}

// Helper: map severity to priority
function mapSeverityToPriority(input) {
    if (!input) return 'medium';
    const s = input.toLowerCase();
    if (s.includes('urgent') || s.includes('danger') || s.includes('critical') || s.includes('severe') || s.includes('high')) return 'urgent';
    if (s.includes('moderate') || s.includes('medium')) return 'medium';
    if (s.includes('low') || s.includes('minor')) return 'low';
    return 'medium';
}

// Helper: parse CivicLens text report format to a structured object
function parseCivicLensText(text) {
    const lines = text.split(/\r?\n/);
    let category, issueTypeText, issueTypeImage, severity, description = '';
    let inDescription = false;

    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        if (line.startsWith('- DESCRIPTION:')) { inDescription = true; continue; }
        if (inDescription) { description += (description ? ' ' : '') + raw.trim(); continue; }
        if (line.toUpperCase().startsWith('- CATEGORY:')) category = line.split(':')[1]?.trim();
        if (line.toUpperCase().startsWith('- ISSUE TYPE (FROM TEXT):')) issueTypeText = line.split(':')[1]?.trim();
        if (line.toUpperCase().startsWith('- ISSUE TYPE (FROM IMAGE):')) issueTypeImage = line.split(':')[1]?.trim();
        if (line.toUpperCase().startsWith('- SEVERITY:')) severity = line.split(':')[1]?.trim();
    }

    const title = (issueTypeImage || issueTypeText || 'Civic Issue').trim();
    const mappedCategory = mapCategory(category);
    const priority = mapSeverityToPriority(severity);

    return { title, description: description || title, category: mappedCategory, priority };
}

// Ingest CivicLens report (accepts either {textReport} or {jsonReport})
async function ingestCivicLensReport(req, res) {
    try {
        const { textReport, jsonReport, location, coordinates, images } = req.body || {};

        let payload;
        if (textReport && typeof textReport === 'string') {
            payload = parseCivicLensText(textReport);
        } else if (jsonReport && typeof jsonReport === 'object') {
            const title = (jsonReport.issueTypeImage || jsonReport.issueTypeText || jsonReport.title || 'Civic Issue').trim();
            payload = {
                title,
                description: jsonReport.description || title,
                category: mapCategory(jsonReport.category || jsonReport.categoryName),
                priority: mapSeverityToPriority(jsonReport.severity || jsonReport.priority)
            };
        } else {
            return res.status(400).json({ success: false, message: 'Provide textReport (string) or jsonReport (object)' });
        }

        // Ensure required fields
        if (!payload.title || !payload.description || !payload.category) {
            return res.status(400).json({ success: false, message: 'Parsed report missing required fields' });
        }

        // Generate unique issue ID (reuse logic)
        let issueId;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        while (!isUnique && attempts < maxAttempts) {
            issueId = generateIssueId();
            const existingIssue = await IssueModel.findOne({ issueId });
            if (!existingIssue) isUnique = true;
            attempts++;
        }
        if (!isUnique) {
            return res.status(500).json({ success: false, message: 'Unable to generate unique issue ID.' });
        }

        // Create the issue
        const newIssue = new IssueModel({
            title: payload.title,
            description: payload.description,
            category: payload.category,
            location: location || '',
            coordinates: (coordinates && coordinates.lat && coordinates.lng) ? { lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lng) } : null,
            images: images || [],
            issueId,
            status: 'pending',
            priority: payload.priority || 'medium'
        });

        const savedIssue = await newIssue.save();
        res.status(201).json({ success: true, message: 'CivicLens report ingested', data: { issueId: savedIssue.issueId } });
    } catch (error) {
        console.error('Error ingesting CivicLens report:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
    }
}
