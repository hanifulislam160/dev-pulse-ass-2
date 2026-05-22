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




export const issueService = {
  createIssueIntoDB,
  getAllIssues,
  getSingleIssueFromDB,
};
