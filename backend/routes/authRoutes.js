import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  getPendingApprovals, 
  updateApprovalStatus,
  submitAppeal,
  getAppeals,
  updateVerificationData,
  getVerificationRecommendations,
  updateBeneficiaryData
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);

// Admin-only routes
router.get('/pending-approvals', auth, getPendingApprovals);
router.post('/update-approval', auth, updateApprovalStatus);
router.get('/appeals', auth, getAppeals);
router.get('/verification-recommendations', auth, getVerificationRecommendations);

// User routes
router.post('/submit-appeal', auth, submitAppeal);
router.put('/verification-data/:userId', auth, updateVerificationData);
router.put('/update-beneficiary-data', auth, updateBeneficiaryData);

export default router;
