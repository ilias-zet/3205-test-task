import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://user:password@db:5432/mydb',
});

export default pool;
