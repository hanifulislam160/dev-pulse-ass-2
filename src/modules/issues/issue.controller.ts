import type { Request, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import { issueService } from "./issue.service";

const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { title, description, type } = req.body;

    // Validation
    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "title, description, and type are required",
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
    }

    // bug or feature_request
    if (type !== "bug" && type !== "feature_request") {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'bug' or 'feature_request'",
      });
    }

    const result = await issueService.createIssueIntoDB(
      { title, description, type },
      user.id,
    );

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create issue",
    });
  }
};




const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    const result = await issueService.getAllIssues({
      sort: sort as any,
      type: type as any,
      status: status as any,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch issues",
    });
  }
};


const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const result = await issueService.getSingleIssueFromDB(id);

    // Not found
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch issue",
    });
  }
};



const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    if (isNaN(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const user = req.user;

    const { title, description, type } = req.body;

    // Optional validation
    if (description && description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
    }

    const result = await issueService.updateIssue(issueId, user, {
      title,
      description,
      type,
    });

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message || "Failed to update issue",
    });
  }
};


const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    // Validate ID
    if (isNaN(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    await issueService.deleteIssueFromDB(issueId);

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Failed to delete issue",
    });
  }
};



export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
