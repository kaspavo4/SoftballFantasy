const { Pool } = require("pg");

const connectionString =
"postgresql://postgres:ylFwcBwcNfkjRHTMIpVuHDImqbxKxbDH@autorack.proxy.rlwy.net:58239/railway";

const pool = new Pool({
  connectionString,
});

module.exports = pool;