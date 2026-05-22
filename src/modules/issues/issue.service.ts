import { pool } from "../../db";
import type { CreateIssuePayload, GetIssuesQuery, IssueWithReporter, SingleIssue } from "./issue.interface";



const createIssueIntoDB = async (
  payload: CreateIssuePayload,
  reporterId: number,
) => {
  const { title, description, type } = payload;

  const query = `
    INSERT INTO issues
      (title, description, type, reporter_id)
    VALUES
      ($1, $2, $3, $4)
    RETURNING 
      id,
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    title,
    description,
    type,
    reporterId,
  ]);

  return result.rows[0];
};



const getAllIssues = async (
  query: GetIssuesQuery,
): Promise<IssueWithReporter[]> => {
  const { sort = "newest", type, status } = query;

  let conditions: string[] = [];
  let values: any[] = [];

  if (type) {
    values.push(type);
    conditions.push(`i.type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`i.status = $${values.length}`);
  }

  let sql = `
    SELECT 
      i.id,
      i.title,
      i.description,
      i.type,
      i.status,
      i.created_at,
      i.updated_at,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
      ) AS reporter
    FROM issues i
    JOIN users u ON i.reporter_id = u.id
  `;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql +=
    sort === "oldest"
      ? " ORDER BY i.created_at ASC"
      : " ORDER BY i.created_at DESC";

  const result = await pool.query(sql, values);

  return result.rows;
};



// get single Issue

const getSingleIssueFromDB = async (id: number): Promise<SingleIssue | null> => {
  const sql = `
    SELECT 
      i.id,
      i.title,
      i.description,
      i.type,
      i.status,
      i.created_at,
      i.updated_at,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
      ) AS reporter
    FROM issues i
    JOIN users u ON i.reporter_id = u.id
    WHERE i.id = $1
  `;

  const result = await pool.query(sql, [id]);

  return result.rows[0] || null;
};


interface UpdateIssuePayload {
  title?: string;
  description?: string;
  type?: "bug" | "feature_request";
}

const updateIssue = async (
  issueId: number,
  user: any,
  payload: UpdateIssuePayload,
) => {
  // Find existing issue
  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    issueId,
  ]);

  // Not found
  if (existingIssue.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = existingIssue.rows[0];

  // Permission Logic

  // Maintainer can update anything
  if (user.role !== "maintainer") {
    // Contributor can only update own issue
    if (issue.reporter_id !== user.id) {
      throw new Error("You are not allowed to update this issue");
    }

    // Contributor can update only open issues
    if (issue.status !== "open") {
      throw new Error("You can only update open issues");
    }
  }

  // Update values
  const updatedTitle = payload.title || issue.title;

  const updatedDescription = payload.description || issue.description;

  const updatedType = payload.type || issue.type;

  // Update query
  const result = await pool.query(
    `
      UPDATE issues
      SET
        title = $1,
        description = $2,
        type = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `,
    [updatedTitle, updatedDescription, updatedType, issueId],
  );

  return result.rows[0];
};

const deleteIssueFromDB = async (issueId: number) => {
  // Check issue exists
  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    issueId,
  ]);

  if (existingIssue.rows.length === 0) {
    throw new Error("Issue not found");
  }

  // Delete issue
  await pool.query(`DELETE FROM issues WHERE id = $1`, [issueId]);

  return true;
};


export const issueService = {
  createIssueIntoDB,
  getAllIssues,
  getSingleIssueFromDB,
  updateIssue,
  deleteIssueFromDB
};