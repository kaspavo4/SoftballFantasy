const { Client } = require('pg');
const bcrypt = require('bcrypt');

class DBClient {
  constructor() {
    var connectionString = "postgres://userName:password@serverName/ip:port/nameOfDatabase";
    this.client = new pg.Client(connectionString);
    console.log("xdddd")
  }

  // Připojení k databázi
  async connect() {
    try {
      await this.client.connect();
      console.log('Připojeno k databázi');
    } catch (error) {
      console.error('Chyba při připojování k databázi:', error);
      throw error;  // Hodíme chybu dál, aby byla zachycena v hlavní logice
    }
  }

  // Vložení uživatele (s hashováním hesla)
  async insertUser(username, password) {
    try {
      // Hashování hesla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Vložení dat do tabulky users
      await this.client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)', 
        [username, hashedPassword]
      );
      console.log('Uživatel registrován!');
    } catch (error) {
      console.error('Chyba při registraci uživatele:', error);
      throw error;  // Hodíme chybu dál
    }
  }

  // Zavření připojení k databázi
  async close() {
    try {
      await this.client.end();
      console.log('Připojení k databázi uzavřeno');
    } catch (error) {
      console.error('Chyba při uzavírání připojení:', error);
    }
  }
}

// Příklad použití třídy DBClient pro registraci uživatele
(async () => {
  const dbClient = new DBClient();
  
  try {
    // Připojení k databázi
    await dbClient.connect();

    // Registrace uživatele
    await dbClient.insertUser('uzivatel1', 'tajneheslo');
  } catch (error) {
    console.error('Chyba v aplikaci:', error);
  } finally {
    // Uzavření připojení
    await dbClient.close();
  }
})();

new DBClient();