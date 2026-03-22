const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres@postgres/planka',
  });
  await client.connect();

  // Insert a test notification for Demo Demo (moveCard by Usuário Teste)
  const result = await client.query(
    `INSERT INTO notification (user_id, creator_user_id, board_id, card_id, type, data, is_read)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, type, is_read`,
    [
      '1724409781784937473', // user_id: Demo Demo
      '1729047405774504990', // creator_user_id: Usuário Teste
      '1724410814665851909', // board_id: Quadro de Teste
      '1729040543113020444', // card_id: TESTE
      'moveCard',
      JSON.stringify({
        fromList: { name: 'Lista de Teste' },
        toList: { name: 'Lista de Teste 1' },
      }),
      false,
    ],
  );

  console.log('Notification created:', JSON.stringify(result.rows));

  // Insert another notification (comment)
  const result2 = await client.query(
    `INSERT INTO notification (user_id, creator_user_id, board_id, card_id, type, data, is_read)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, type, is_read`,
    [
      '1724409781784937473', // user_id: Demo Demo
      '1729047405774504990', // creator_user_id: Usuário Teste
      '1724410814665851909', // board_id: Quadro de Teste
      '1729040543113020444', // card_id: TESTE
      'commentCard',
      JSON.stringify({
        text: 'Este é um comentário de teste para verificar notificações!',
      }),
      false,
    ],
  );

  console.log('Comment notification created:', JSON.stringify(result2.rows));

  // Verify
  const check = await client.query(
    'SELECT id, type, is_read FROM notification WHERE user_id = $1',
    ['1724409781784937473'],
  );
  console.log('\nAll notifications for Demo Demo:', JSON.stringify(check.rows));

  await client.end();
}

main().catch(console.error);
