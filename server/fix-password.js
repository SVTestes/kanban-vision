const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function main() {
  const password = 'test123';
  const hash = await bcrypt.hash(password, 10);

  const client = new Client({
    connectionString: 'postgresql://postgres@postgres/planka',
  });

  await client.connect();

  const result = await client.query(
    'UPDATE user_account SET password = $1 WHERE email = $2 RETURNING id, name',
    [hash, 'teste@teste.com'],
  );

  console.log('Updated user:', JSON.stringify(result.rows));

  // Verify the hash works
  const ok = await bcrypt.compare(password, hash);
  console.log('Password verification:', ok);

  await client.end();
}

main().catch(console.error);
