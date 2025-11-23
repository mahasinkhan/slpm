// src/controllers/approval.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../types';
import * as approvalService from '../services/approval.service';
import { AppError } from '../utils/AppError';

export const getApprovalStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = req.user.id;
    const role = req.user.role;
    
    const stats = await approvalService.getApprovalStatistics(userId, role);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval statistics'
    });
  }
};

export const getApprovals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = req.user.id;
    const role = req.user.role;
    
    const filters = {
      status: req.query.status as string,
      type: req.query.type as string,
      priority: req.query.priority as string,
      search: req.query.search as string,
      dateRange: req.query.dateRange as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20
    };
    
    const result = await approvalService.getApprovals(userId, role, filters);
    
    res.json({
      success: true,
      data: result.approvals,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / filters.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approvals'
    });
  }
};

export const getApprovalById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    const approval = await approvalService.getApprovalById(id, userId, role);
    
    if (!approval) {
      res.status(404).json({
        success: false,
        message: 'Approval not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Error fetching approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval'
    });
  }
};

export const createApproval = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userId = req.user.id;
    const user = req.user;
    
    const approvalData = {
      ...req.body,
      submitterId: userId,
      submitterName: `${user.firstName} ${user.lastName}`,
      submitterEmail: user.email,
      submitterAvatar: user.avatar || null
    };
    
    const approval = await approvalService.createApproval(approvalData);
    
    res.status(201).json({
      success: true,
      message: 'Approval request created successfully',
      data: approval
    });
  } catch (error) {
    console.error('Error creating approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create approval request'
    });
  }
};

export const updateApproval = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { id } = req.params;
    const userId = req.user.id;
    
    const approval = await approvalService.updateApproval(id, userId, req.body);
    
    res.json({
      success: true,
      message: 'Approval updated successfully',
      data: approval
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Error updating approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update approval'
    });
  }
};

export const makeDecision = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { id } = req.params;
    const { decision, notes } = req.body;
    const approver = req.user;
    
    const approval = await approvalService.makeDecision(id, decision, approver, notes);
    
    res.json({
      success: true,
      message: `Approval ${decision.toLowerCase()} successfully`,
      data: approval
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Error making decision:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process decision'
    });
  }
};

export const deleteApproval = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    await approvalService.deleteApproval(id, userId, role);
    
    res.json({
      success: true,
      message: 'Approval deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Error deleting approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete approval'
    });
  }
};

export const bulkApprove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { approvalIds } = req.body;
    const approver = req.user;
    
    if (!Array.isArray(approvalIds) || approvalIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid approval IDs'
      });
      return;
    }
    
    const results = await approvalService.bulkApprove(approvalIds, approver);
    
    res.json({
      success: true,
      message: `${results.success} approvals approved, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    console.error('Error bulk approving:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve'
    });
  }
};

export const bulkReject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { approvalIds, notes } = req.body;
    const approver = req.user;
    
    if (!Array.isArray(approvalIds) || approvalIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid approval IDs'
      });
      return;
    }
    
    const results = await approvalService.bulkReject(approvalIds, approver, notes);
    
    res.json({
      success: true,
      message: `${results.success} approvals rejected, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    console.error('Error bulk rejecting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk reject'
    });
  }
};