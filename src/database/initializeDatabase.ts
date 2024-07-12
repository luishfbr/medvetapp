import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(
  database: SQLiteDatabase
): Promise<void> {
  try {
    // Criação da tabela clients
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner TEXT NOT NULL
      );
    `);

    console.log("clients criado");
    // Criação da tabela animals
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS animals (
        idAnimal INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        client_id INTEGER NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log("animals criado");

    // Criação da tabela budget
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS budget (
        idBudget INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATETIME NOT NULL,
        description TEXT NOT NULL,
        value REAL NOT NULL,
        amountPaid REAL NOT NULL,
        animal_id INTEGER NOT NULL,
        FOREIGN KEY (animal_id) REFERENCES animals(idAnimal) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log("budget criado");

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
