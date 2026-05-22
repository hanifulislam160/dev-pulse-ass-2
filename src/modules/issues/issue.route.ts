import express from "express";

import {
  authMiddleware,
  authorizeRole,
} from "../../middleware/auth.middleware";

import { issueController } from "./issue.controller";

const router = express.Router();

// contributor + maintainer
router.post(
  "/issues",
  authMiddleware,
  authorizeRole("contributor", "maintainer"),
  issueController.createIssue,
);

router.get("/issues", issueController.getAllIssues);
router.get("/issues/:id", issueController.getSingleIssue);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRole("contributor", "maintainer"),
  issueController.updateIssue,
);

// maintainer only
// router.delete(
//   "/:id",
//   authMiddleware,
//   authorizeRole("maintainer"),
//   issueController.deleteIssue,
// );

export const issueRoutes = router;
