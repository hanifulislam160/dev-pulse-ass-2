import { pool } from "../../db";
const createIssueIntoDB = async (payload, reporterId) => {
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
const getAllIssues = async (query) => {
    const { sort = "newest", type, status } = query;
    let conditions = [];
    let values = [];
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
    json_build_object(
      'id', u.id,
      'name', u.name,
      'role', u.role
    ) AS reporter,
    i.created_at,
    i.updated_at
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
const getSingleIssueFromDB = async (id) => {
    const sql = `
    SELECT 
      i.id,
      i.title,
      i.description,
      i.type,
      i.status,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
      ) AS reporter,
      i.created_at,
      i.updated_at
    FROM issues i
    JOIN users u ON i.reporter_id = u.id
    WHERE i.id = $1
  `;
    const result = await pool.query(sql, [id]);
    return result.rows[0] || null;
};
const updateIssue = async (issueId, user, payload) => {
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
    const result = await pool.query(`
      UPDATE issues
      SET
        title = $1,
        description = $2,
        type = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [updatedTitle, updatedDescription, updatedType, issueId]);
    return result.rows[0];
};
const deleteIssueFromDB = async (issueId) => {
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
    deleteIssueFromDB,
};
//# sourceMappingURL=issue.service.js.map