exports.up = async function(db) {
  // Create 'users' table if it doesn't exist
  const hasUsersTable = await db.schema.hasTable('users');
  
  if (!hasUsersTable) {
    await db.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('plan').defaultTo('free');
      table.integer('requests_used').defaultTo(0);
      table.timestamp('plan_start_date').defaultTo(db.fn.now());
      table.timestamp('plan_renewal_date');
      table.timestamps(true, true);
    });
  } else {
    // Add subscription columns to existing users table
    const hasColumns = {
      plan: await db.schema.hasColumn('users', 'plan'),
      requestsUsed: await db.schema.hasColumn('users', 'requests_used'),
      planStartDate: await db.schema.hasColumn('users', 'plan_start_date'),
      planRenewalDate: await db.schema.hasColumn('users', 'plan_renewal_date')
    };
    
    // Add missing columns
    await db.schema.table('users', function(table) {
      if (!hasColumns.plan) {
        table.string('plan').defaultTo('free');
      }
      if (!hasColumns.requestsUsed) {
        table.integer('requests_used').defaultTo(0);
      }
      if (!hasColumns.planStartDate) {
        table.timestamp('plan_start_date').defaultTo(db.fn.now());
      }
      if (!hasColumns.planRenewalDate) {
        table.timestamp('plan_renewal_date');
      }
    });
  }
  
  // Create 'plans' table
  const hasPlansTable = await db.schema.hasTable('plans');
  
  if (!hasPlansTable) {
    await db.schema.createTable('plans', function(table) {
      table.string('id').primary();
      table.string('name').notNullable();
      table.float('price').notNullable();
      table.float('monthly_price');
      table.string('description').notNullable();
      table.boolean('popular').defaultTo(false);
      table.string('badge');
      table.integer('request_limit').notNullable();
      table.json('export_formats').notNullable();
      table.json('features').notNullable();
      table.timestamps(true, true);
    });
    
    // Insert default plans
    await db('plans').insert([
      {
        id: 'free',
        name: 'Gratuito',
        price: 0,
        description: 'Para criadores iniciantes',
        request_limit: 3,
        export_formats: JSON.stringify(['txt']),
        features: JSON.stringify([
          { name: 'Geração básica de roteiros', included: true },
          { name: 'Até 3 roteiros por mês', included: true },
          { name: 'Exportação em TXT', included: true },
          { name: 'Salvar roteiros localmente', included: true },
          { name: 'Personalização avançada', included: false },
          { name: 'Modos criativos especiais', included: false },
          { name: 'Exportação profissional (PDF, FDX)', included: false },
          { name: 'Análise de roteiro com IA', included: false },
        ])
      },
      {
        id: 'starter',
        name: 'Iniciante',
        price: 27.9,
        description: 'Para criadores regulares',
        popular: true,
        badge: 'Mais Popular',
        request_limit: 30,
        export_formats: JSON.stringify(['txt', 'pdf']),
        features: JSON.stringify([
          { name: 'Geração avançada de roteiros', included: true },
          { name: 'Até 30 roteiros por mês', included: true },
          { name: 'Exportação em TXT e PDF', included: true },
          { name: 'Salvar roteiros localmente', included: true },
          { name: 'Personalização avançada', included: true },
          { name: 'Modos criativos especiais', included: true },
          { name: 'Exportação profissional (FDX)', included: false },
          { name: 'Análise de roteiro com IA', included: false },
        ])
      },
      {
        id: 'pro',
        name: 'Profissional',
        price: 79.9,
        monthly_price: 99.9,
        description: 'Para criadores profissionais',
        badge: 'Desconto de 20%',
        request_limit: -1, // -1 represents infinity
        export_formats: JSON.stringify(['txt', 'pdf', 'fdx']),
        features: JSON.stringify([
          { name: 'Geração avançada de roteiros', included: true },
          { name: 'Roteiros ilimitados', included: true },
          { name: 'Exportação em TXT, PDF e FDX', included: true },
          { name: 'Salvar roteiros localmente', included: true },
          { name: 'Personalização avançada', included: true },
          { name: 'Modos criativos especiais', included: true },
          { name: 'Exportação profissional (FDX)', included: true },
          { name: 'Análise de roteiro com IA', included: true },
        ])
      }
    ]);
  }
};

exports.down = async function(db) {
  // This is for rollback
  // Drop columns related to subscriptions
  const hasUsersTable = await db.schema.hasTable('users');
  
  if (hasUsersTable) {
    await db.schema.table('users', function(table) {
      table.dropColumn('plan');
      table.dropColumn('requests_used');
      table.dropColumn('plan_start_date');
      table.dropColumn('plan_renewal_date');
    });
  }
  
  // Drop plans table
  await db.schema.dropTableIfExists('plans');
};