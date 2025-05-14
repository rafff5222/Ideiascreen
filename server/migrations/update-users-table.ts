import { db } from '../db';
import { sql } from 'drizzle-orm';

export async function applyMigrations() {
  console.log('Verificando e aplicando migrações necessárias...');

  try {
    // Verificar se a tabela de usuários existe e se possui as colunas necessárias
    const checkEmailColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='email';
    `);

    // Se a coluna de email não existe, adicioná-la
    if (checkEmailColumn.rows.length === 0) {
      console.log('Adicionando coluna email à tabela users...');
      await db.execute(sql`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
      `);
    }

    // Verificar e adicionar as outras colunas necessárias
    const columnsToAdd = [
      { name: 'name', type: 'TEXT' },
      { name: 'profile_image_url', type: 'TEXT' },
      { name: 'plan_type', type: 'VARCHAR(50) DEFAULT \'free\' NOT NULL' },
      { name: 'requests_used', type: 'INTEGER DEFAULT 0 NOT NULL' },
      { name: 'requests_limit', type: 'INTEGER DEFAULT 10 NOT NULL' },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW() NOT NULL' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT NOW() NOT NULL' },
      { name: 'last_login_at', type: 'TIMESTAMP' },
      { name: 'email_verified', type: 'BOOLEAN DEFAULT FALSE NOT NULL' }
    ];

    for (const column of columnsToAdd) {
      const checkColumn = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users' AND column_name=${column.name};
      `);

      if (checkColumn.rows.length === 0) {
        console.log(`Adicionando coluna ${column.name} à tabela users...`);
        await db.execute(sql`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS ${sql.raw(column.name)} ${sql.raw(column.type)};
        `);
      }
    }

    // Verificar e criar a tabela de sessions se não existir
    const checkSessionsTable = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name='sessions';
    `);

    if (checkSessionsTable.rows.length === 0) {
      console.log('Criando tabela sessions...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS sessions (
          sid VARCHAR(255) PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        );
        CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
      `);
    }

    console.log('Todas as migrações foram aplicadas com sucesso!');
  } catch (error) {
    console.error('Erro ao aplicar migrações:', error);
    throw error;
  }
}