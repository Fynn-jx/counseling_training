// @ts-nocheck
export default async function handler(req, res) {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiUrl, apiKey, payload } = req.body;

    if (!apiUrl || !apiKey || !payload) {
      return res.status(400).json({ error: '缺少必要参数: apiUrl, apiKey, payload' });
    }

    // 构建目标 URL
    const targetUrl = `${apiUrl}/chat-messages`;

    console.log('转发请求到:', targetUrl);

    // 转发请求到后端 API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('API响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', errorText);
      return res.status(response.status).json({ error: `API请求失败: ${response.status} ${errorText}` });
    }

    const data = await response.json();

    // 返回响应，设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    return res.status(500).json({
      error: error.message || '请求失败'
    });
  }
}
