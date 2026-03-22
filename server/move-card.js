const http = require('http');

function apiCall(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);
    const req = http.request({
      hostname: 'localhost', port: 1337, path: '/api' + path, method, headers,
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log('1. Logging in...');
  const loginRes = await apiCall('POST', '/access-tokens', {
    emailOrUsername: 'teste@teste.com',
    password: 'test123',
  });
  
  let token;
  if (loginRes.code === 'E_FORBIDDEN' && loginRes.pendingToken) {
    console.log('Terms acceptance required, using pending token...');
    // Accept terms
    const acceptRes = await apiCall('POST', '/access-tokens/accept-terms', {}, loginRes.pendingToken);
    console.log('Accept terms result:', JSON.stringify(acceptRes).substring(0, 200));
    token = acceptRes.item || loginRes.pendingToken;
  } else if (loginRes.item) {
    token = loginRes.item;
  } else {
    console.error('Login failed:', JSON.stringify(loginRes));
    return;
  }
  console.log('Token type:', typeof token);

  console.log('\n2. Getting board...');
  const boardRes = await apiCall('GET', '/boards/1724410814665851909', null, token);
  
  if (boardRes.code) {
    console.error('Board fetch error:', JSON.stringify(boardRes).substring(0, 300));
    return;
  }
  
  const lists = boardRes.included && boardRes.included.lists ? boardRes.included.lists : [];
  console.log('Lists found:', lists.map(l => l.name + ' (' + l.id + ')').join(', '));

  const targetList = lists.find(l => l.name && l.name.includes('Teste 1'));
  if (!targetList) {
    console.error('Could not find target list');
    console.log('Available lists:', JSON.stringify(lists.map(l => l.name)));
    return;
  }

  console.log('\n3. Moving card TESTE to', targetList.name);
  const moveRes = await apiCall('PATCH', '/cards/1729040543113020444', {
    listId: targetList.id,
    position: 65535,
  }, token);
  console.log('Move result:', JSON.stringify(moveRes).substring(0, 400));

  console.log('\nDone!');
}

main().catch(console.error);
