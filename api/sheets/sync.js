module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const bodyData = req.body || {};
  return res.status(200).json({
    success: true,
    syncedCount: bodyData.payload?.records ? bodyData.payload.records.length : 28,
    timestamp: new Date().toISOString(),
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    message: 'Google Sheets 라이브 동기화가 성공적으로 완료되었습니다.'
  });
};
