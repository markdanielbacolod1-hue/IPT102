async function getUserActivity(req, res) {
  const { id } = req.params;
  const isAdmin = req.user.role === 'Admin';
  const isSelf  = req.user.userId === parseInt(id);

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  try {
    const [logs] = await db.query(
      `SELECT log_id, activity, activity_time
       FROM user_activity_logs
       WHERE user_id = ?
       ORDER BY activity_time DESC
       LIMIT 20`,
      [id]
    );

    return res.json({ logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}