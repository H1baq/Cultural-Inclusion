import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Fallback JWT secret for development
const JWT_SECRET = process.env.JWT_SECRET || 'heva-cultural-inclusion-dev-secret-key-2024';

// Register new user with role restrictions
export const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phoneNumber, 
      location, 
      vulnerabilityFactors,
      references,
      idDocument 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Role-based registration restrictions
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin registration is restricted. Contact system administrator.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with role-specific defaults
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      location,
      isApproved: role === 'officer', // Officers are auto-approved
      approvalStatus: role === 'officer' ? 'approved' : 'pending'
    };

    // Add role-specific fields
    if (role === 'officer') {
      userData.officerId = `OFF-${Date.now()}`;
      userData.assignedRegions = [];
    } else if (role === 'beneficiary') {
      userData.beneficiaryId = `BEN-${Date.now()}`;
      userData.vulnerabilityFactors = vulnerabilityFactors || [];
      userData.registrationSource = 'self';
    }

    // Add verification data
    userData.verificationData = {
      idDocument: idDocument || {},
      references: references || [],
      documents: []
    };

    const user = new User(userData);
    
    // Calculate initial trust score
    user.trustScore = user.calculateTrustScore();
    user.updateRiskLevel();
    
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        approvalStatus: user.approvalStatus,
        trustScore: user.trustScore,
        riskLevel: user.riskLevel
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login with role-based access
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check approval status for non-admin users
    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(403).json({ 
        message: 'Account pending approval. Please contact an administrator.',
        approvalStatus: user.approvalStatus,
        appealStatus: user.appealStatus
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        approvalStatus: user.approvalStatus,
        trustScore: user.trustScore,
        riskLevel: user.riskLevel,
        // Role-specific data
        ...(user.role === 'officer' && {
          officerId: user.officerId,
          assignedRegions: user.assignedRegions,
          totalBeneficiariesRegistered: user.totalBeneficiariesRegistered,
          verificationLevel: user.verificationLevel
        }),
        ...(user.role === 'beneficiary' && {
          beneficiaryId: user.beneficiaryId,
          vulnerabilityFactors: user.vulnerabilityFactors
        })
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending approvals (Admin only)
export const getPendingApprovals = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pendingUsers = await User.find({ 
      approvalStatus: { $in: ['pending', 'under_review'] },
      role: { $in: ['officer', 'beneficiary'] }
    }).select('-password');

    res.json(pendingUsers);
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve/Reject user (Admin only)
export const updateApprovalStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId, approvalStatus, approvalComment, rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.approvalStatus = approvalStatus;
    user.isApproved = approvalStatus === 'approved';
    user.approvalComment = approvalComment;
    user.rejectionReason = rejectionReason;
    user.approvedBy = req.user.userId;
    user.approvedAt = new Date();

    // Reset appeal status if approved
    if (approvalStatus === 'approved') {
      user.appealStatus = 'none';
      user.appealComment = '';
    }

    await user.save();

    res.json({
      message: `User ${approvalStatus} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        approvalComment: user.approvalComment,
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    console.error('Update approval status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit appeal (Beneficiaries only)
export const submitAppeal = async (req, res) => {
  try {
    const { appealComment } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.approvalStatus !== 'rejected') {
      return res.status(400).json({ message: 'Can only appeal rejected applications' });
    }

    if (user.appealStatus !== 'none') {
      return res.status(400).json({ message: 'Appeal already submitted' });
    }

    user.appealStatus = 'pending';
    user.appealComment = appealComment;
    user.appealSubmittedAt = new Date();

    await user.save();

    res.json({
      message: 'Appeal submitted successfully',
      appealStatus: user.appealStatus,
      appealSubmittedAt: user.appealSubmittedAt
    });
  } catch (error) {
    console.error('Submit appeal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appeals (Admin only)
export const getAppeals = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appeals = await User.find({ 
      appealStatus: 'pending',
      approvalStatus: 'rejected'
    }).select('-password');

    res.json(appeals);
  } catch (error) {
    console.error('Get appeals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update verification data
export const updateVerificationData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verificationData } = req.body;

    // Only admins and officers can update verification data
    if (req.user.role !== 'admin' && req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update verification data
    if (verificationData) {
      user.verificationData = { ...user.verificationData, ...verificationData };
    }

    // Recalculate trust score
    user.trustScore = user.calculateTrustScore();
    user.updateRiskLevel();

    await user.save();

    res.json({
      message: 'Verification data updated successfully',
      user: {
        id: user._id,
        name: user.name,
        trustScore: user.trustScore,
        riskLevel: user.riskLevel,
        verificationData: user.verificationData
      }
    });
  } catch (error) {
    console.error('Update verification data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get verification recommendations
export const getVerificationRecommendations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({ 
      role: { $in: ['officer', 'beneficiary'] },
      trustScore: { $lt: 70 }
    }).select('name email role trustScore riskLevel verificationData');

    // Sort by risk level and trust score
    const recommendations = users.sort((a, b) => {
      const riskOrder = { high: 3, medium: 2, low: 1 };
      if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
      return a.trustScore - b.trustScore;
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Get verification recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update beneficiary data
export const updateBeneficiaryData = async (req, res) => {
  try {
    const { 
      personalInfo, 
      contactInfo, 
      financialInfo, 
      programPreferences,
      additionalDocuments 
    } = req.body;

    // Only beneficiaries can update their own data
    if (req.user.role !== 'beneficiary') {
      return res.status(403).json({ message: 'Access denied - Beneficiaries only' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update personal information
    if (personalInfo) {
      user.personalInfo = { ...user.personalInfo, ...personalInfo };
    }

    // Update contact information
    if (contactInfo) {
      user.contactInfo = { ...user.contactInfo, ...contactInfo };
    }

    // Update financial information
    if (financialInfo) {
      user.financialInfo = { ...user.financialInfo, ...financialInfo };
    }

    // Update program preferences
    if (programPreferences) {
      user.programPreferences = { ...user.programPreferences, ...programPreferences };
    }

    // Update additional documents
    if (additionalDocuments) {
      user.additionalDocuments = { ...user.additionalDocuments, ...additionalDocuments };
    }

    // Update last modified timestamp
    user.lastModified = new Date();

    await user.save();

    res.json({
      message: 'Beneficiary data updated successfully',
      user: {
        id: user._id,
        name: user.name,
        personalInfo: user.personalInfo,
        contactInfo: user.contactInfo,
        financialInfo: user.financialInfo,
        programPreferences: user.programPreferences,
        lastModified: user.lastModified
      }
    });
  } catch (error) {
    console.error('Update beneficiary data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
