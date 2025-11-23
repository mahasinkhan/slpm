import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticateToken, authorize } from '../middleware/auth.middleware';

const router = Router();
const interviewController = new InterviewController();

// Make sure this route exists!
router.get('/:id', interviewController.getInterviewById);

// Other routes
router.post('/', authenticateToken, interviewController.createInterview);
router.get('/', interviewController.getAllInterviews);
router.put('/:id', authenticateToken, interviewController.updateInterview);
router.patch('/:id/approve', authenticateToken, authorize(['ADMIN', 'SUPERADMIN']), interviewController.approveInterview);
router.patch('/:id/reject', authenticateToken, authorize(['ADMIN', 'SUPERADMIN']), interviewController.rejectInterview);
router.delete('/:id', authenticateToken, authorize(['ADMIN', 'SUPERADMIN']), interviewController.deleteInterview);

export default router;