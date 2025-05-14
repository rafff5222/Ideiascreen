import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

export async function createTables() {
  console.log('Iniciando criação/atualização das tabelas...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não configurada');
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  try {
    console.log('Criando tabela de usuários se não existir...');
    
    // Essa é uma migração manual, em produção seria melhor usar o Drizzle Migrate
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        profile_image_url TEXT,
        plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
        requests_used INTEGER NOT NULL DEFAULT 0,
        requests_limit INTEGER NOT NULL DEFAULT 10,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMP,
        email_verified INTEGER NOT NULL DEFAULT 0
      );
    `);
    
    console.log('Criando tabela de conteúdo se não existir...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_items (
        id SERIAL PRIMARY KEY,
        content_type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        topic TEXT NOT NULL,
        communication_style VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Criando tabela de sessões se não existir...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) NOT NULL PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS sessions_expire_idx ON sessions (expire);
    `);
    
    console.log('Tabelas criadas/atualizadas com sucesso!');
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar/atualizar tabelas:', error);
    return { success: false, error };
  } finally {
    await pool.end();
  }
}

// Para execução direta, descomentar e rodar como módulo CommonJS
// Esta seção foi comentada porque o ES Modules não suporta require.main
/*
if (import.meta.url === import.meta.main) {
  createTables()
    .then((result) => {
      if (result.success) {
        console.log('Migração concluída com sucesso!');
      } else {
        console.error('Falha na migração:', result.error);
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Erro ao executar migração:', err);
      process.exit(1);
    });
}
*/