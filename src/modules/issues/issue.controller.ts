import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import { issueService } from "./issue.service";
import AppError from "../../utils/AppError";
import sendResponse from "../../utils/sendResponse";

// create issue
const createIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError(
        401,
        "Unauthorized access: Missing session user context",
      );
    }

    const { title, description, type } = req.body;

    // Validation
    if (!title || !description || !type) {
      throw new AppError(
        400,
        "Title, description, and type are required fields",
      );
    }

    if (description.length < 20) {
      throw new AppError(
        400,
        "Description must be at least 20 characters long",
      );
    }

    // bug or feature_request
    if (type !== "bug" && type !== "feature_request") {
      throw new AppError(400, "Type must be either 'bug' or 'feature_request'");
    }

    const result = await issueService.createIssueIntoDB(
      { title, description, type },
      user.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// getAllIssues

const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort, type, status } = req.query;
  
    const result = await issueService.getAllIssuesFromDB({
      sort: sort as any,
      type: type as any,
      status: status as any,
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// get single issue

const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    // Validate ID
    if (isNaN(id)) {
      throw new AppError(400, "Invalid issue id");
    }

    const result = await issueService.getSingleIssueFromDB(id);

    // Not found
    if (!result) {
      throw new AppError(404, "Issue not found");
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
    })
  } catch (error) {
    next(error);
  }
};


// updateIssue

const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    if (isNaN(issueId)) {
      throw new AppError(400, "Invalid issue id");
    }

    const user = req.user;

    if (!user) {
      throw new AppError(
        401,
        "Unauthorized access",
      );
    }

    const { title, description, type } = req.body;

    // Optional validation
    if (description && description.length < 20) {
      throw new AppError(
        400,
        "Description must be at least 20 characters long",
      );
    }

    const result = await issueService.updateIssue(issueId, user, {
      title,
      description,
      type,
    });

   sendResponse(res, {
     success: true,
     statusCode: 200,
     message: "Issue updated successfully",
     data: result
   })
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message || "Failed to update issue",
    });
  }
};


// deleteIssue

const deleteIssue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const issueId = Number(req.params.id);

    // Validate id
    if (isNaN(issueId)) {
      throw new AppError(400, "Invalid issue id");
    }

    await issueService.deleteIssueFromDB(issueId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue deleted successfully",
    })
  } catch (error) {
    next(error);
  }
};



export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
