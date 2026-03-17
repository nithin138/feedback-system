const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Flag = require('../models/Flag');

// Admin Dashboard Analytics
const getAdminAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total counts
    const totalFeedbacks = await Feedback.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty', isApproved: true });
    const pendingFaculty = await User.countDocuments({ role: 'faculty', isApproved: false });
    const flaggedPosts = await Flag.countDocuments({ status: 'pending' });

    // Recent feedbacks (last 30 days)
    const recentFeedbacks = await Feedback.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Category distribution
    const categoryDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' }
        }
      }
    ]);

    // Average rating by category
    const avgRatingByCategory = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          averageRating: { $avg: '$averageRating' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalFeedbacks,
          totalStudents,
          totalFaculty,
          pendingFaculty,
          flaggedPosts,
          recentFeedbacks
        },
        categoryDistribution,
        avgRatingByCategory,
        recentActivity
      }
    });
  } catch (err) {
    console.error('Error fetching admin analytics:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Failed to fetch analytics'
      }
    });
  }
};

// Faculty Analytics
const getFacultyAnalytics = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get feedbacks about this faculty (category: faculty)
    const feedbacks = await Feedback.find({
      category: 'faculty',
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Total feedback count
    const totalFeedbacks = feedbacks.length;

    // Calculate average rating
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + parseFloat(f.averageRating), 0) / feedbacks.length
      : 0;

    // Rating distribution
    const ratingDistribution = {
      5: feedbacks.filter(f => parseFloat(f.averageRating) >= 4.5).length,
      4: feedbacks.filter(f => parseFloat(f.averageRating) >= 3.5 && parseFloat(f.averageRating) < 4.5).length,
      3: feedbacks.filter(f => parseFloat(f.averageRating) >= 2.5 && parseFloat(f.averageRating) < 3.5).length,
      2: feedbacks.filter(f => parseFloat(f.averageRating) >= 1.5 && parseFloat(f.averageRating) < 2.5).length,
      1: feedbacks.filter(f => parseFloat(f.averageRating) < 1.5).length
    };

    // Category-wise ratings
    const categoryRatings = {};
    feedbacks.forEach(feedback => {
      feedback.ratings.forEach(rating => {
        if (!categoryRatings[rating.categoryName]) {
          categoryRatings[rating.categoryName] = {
            total: 0,
            count: 0,
            average: 0
          };
        }
        categoryRatings[rating.categoryName].total += rating.value;
        categoryRatings[rating.categoryName].count += 1;
      });
    });

    // Calculate averages
    Object.keys(categoryRatings).forEach(key => {
      categoryRatings[key].average = 
        categoryRatings[key].total / categoryRatings[key].count;
    });

    // Recent feedbacks (last 10)
    const recentFeedbacks = feedbacks.slice(0, 10).map(f => ({
      id: f._id,
      content: f.content,
      rating: f.averageRating,
      createdAt: f.createdAt
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalFeedbacks,
          averageRating: avgRating.toFixed(2),
          period: '30 days'
        },
        ratingDistribution,
        categoryRatings,
        recentFeedbacks
      }
    });
  } catch (err) {
    console.error('Error fetching faculty analytics:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Failed to fetch analytics'
      }
    });
  }
};

module.exports = {
  getAdminAnalytics,
  getFacultyAnalytics
};
