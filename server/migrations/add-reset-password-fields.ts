import { db } from '../db';
import { pool } from '../db';

async function main() {
  try {
    console.log("Iniciando adição de campos de redefinição de senha...");
    
    // Verificar se a coluna reset_password_token já existe
    const checkColumnQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'reset_password_token'
      );
    `;
    
    const { rows: [{ exists: columnExists }] } = await pool.query(checkColumnQuery);
    
    if (columnExists) {
      console.log("Colunas de redefinição de senha já existem. Pulando migração.");
      return;
    }
    
    // Adicionar as colunas
    const addColumnsQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_password_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;
    `;
    
    await pool.query(addColumnsQuery);
    
    console.log("Colunas reset_password_token e reset_password_expires adicionadas com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar colunas de redefinição de senha:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("Migração concluída com sucesso!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro na migração:", error);
    process.exit(1);
  });