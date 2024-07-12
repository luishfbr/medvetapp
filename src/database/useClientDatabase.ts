import { useSQLiteContext } from "expo-sqlite";

export type ClientDatabase = {
  id: number;
  name: string;
  owner: string;
};

export type AnimalDatabase = {
  idAnimal: number;
  name: string;
  client_id: number;
};

export type BudgetDatabase = {
  idBudget: number;
  date: string;
  description: string;
  value: number;
  amountPaid: number;
  animal_id: number;
};

export async function useClientDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<ClientDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO clients (name, owner) VALUES ($name, $owner)"
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $owner: data.owner,
      });

      const insertRowId = result.lastInsertRowId.toLocaleString();
      return { insertRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM clients WHERE name LIKE ?";

      const response = await database.getAllAsync<ClientDatabase>(
        query,
        `%${name}%`
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function update(data: ClientDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE clients SET name = $name, owner = $owner WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $owner: data.owner,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM clients WHERE id = " + id);
    } catch (error) {
      throw error;
    }
  }

  async function show(id: number) {
    try {
      const query = "SELECT * FROM clients WHERE id = ?";

      const response = await database.getFirstAsync<ClientDatabase>(query, [
        id,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function generatePdf(id: number) {
    try {
      const query = "SELECT * FROM animals WHERE client_id = ?";
      const response = await database.getAllAsync<AnimalDatabase>(query, id);

      if (response) {
        for (const animal of response) {
          const budgetQuery = "SELECT * FROM budget WHERE animal_id = ?";
          const budgetResponse = await database.getAllAsync<BudgetDatabase>(
            budgetQuery,
            animal.idAnimal
          );

          console.log(
            `Budget para o animal ${animal.idAnimal}:`,
            budgetResponse
          );
          
        }
      }
    } catch (error) {
      throw error;
    }
  }

  return { create, searchByName, update, remove, show, generatePdf };
}

export async function useAnimalDatabase() {
  const database = useSQLiteContext();

  async function createAnimal(data: Omit<AnimalDatabase, "idAnimal">) {
    const statement = await database.prepareAsync(
      "INSERT INTO animals (name, client_id) VALUES ($name, $client_id)"
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $client_id: data.client_id,
      });

      const insertRowId = result.lastInsertRowId.toLocaleString();
      return { insertRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function searchAnimalByName(name: string, client_id: number) {
    try {
      const query = "SELECT * FROM animals WHERE name LIKE ? AND client_id = ?";
      const response = await database.getAllAsync<AnimalDatabase>(
        query,
        `%${name}%`,
        client_id
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function updateAnimal(data: AnimalDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE animals SET name = $name WHERE idAnimal = $idAnimal"
    );

    try {
      await statement.executeAsync({
        $idAnimal: data.idAnimal,
        $name: data.name,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function removeAnimal(idAnimal: number) {
    try {
      await database.execAsync(
        "DELETE FROM animals WHERE idAnimal = " + idAnimal
      );
    } catch (error) {
      throw error;
    }
  }

  async function showAnimals(idAnimal: number) {
    try {
      const query = "SELECT * FROM animals WHERE idAnimal = ?";

      const response = await database.getFirstAsync<AnimalDatabase>(query, [
        idAnimal,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  return {
    createAnimal,
    searchAnimalByName,
    updateAnimal,
    removeAnimal,
    showAnimals,
  };
}

export async function useBudgetDatabase() {
  const database = useSQLiteContext();

  async function createBudget(data: Omit<BudgetDatabase, "idBudget">) {
    const statement = await database.prepareAsync(
      "INSERT INTO budget (date, description, value, amountPaid, animal_id) VALUES ($date, $description, $value, $amountPaid, $animal_id)"
    );

    try {
      const result = await statement.executeAsync({
        $date: data.date,
        $description: data.description,
        $value: data.value,
        $amountPaid: data.amountPaid,
        $animal_id: data.animal_id,
      });

      const insertRowId = result.lastInsertRowId.toLocaleString();
      return { insertRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateBudget(data: BudgetDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE budget SET date = $date, description = $description, value = $value, amountPaid = $amountPaid WHERE idBudget = $idBudget"
    );

    try {
      await statement.executeAsync({
        $idBudget: data.idBudget,
        $date: data.date,
        $description: data.description,
        $value: data.value,
        $amountPaid: data.amountPaid,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function searchBudgetByDescription(
    description: string,
    animal_id: number
  ) {
    try {
      const query =
        "SELECT * FROM budget WHERE description LIKE ? AND animal_id = ?";
      const response = await database.getAllAsync<BudgetDatabase>(
        query,
        `%${description}%`,
        animal_id
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function removeBudget(idBudget: number) {
    try {
      await database.execAsync(
        "DELETE FROM budget WHERE idBudget = " + idBudget
      );
    } catch (error) {
      throw error;
    }
  }

  async function showBudget(idBudget: number) {
    try {
      const query = "SELECT * FROM budget WHERE idBudget = ?";

      const response = await database.getFirstAsync<BudgetDatabase>(query, [
        idBudget,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  return {
    createBudget,
    updateBudget,
    removeBudget,
    showBudget,
    searchBudgetByDescription,
  };
}

export async function getDataToPdf() {
  const database = useSQLiteContext();

  async function generatePdf(client_id: number) {
    try {
      const query = "SELECT * FROM animals WHERE client_id = ?";
      const response = await database.getAllAsync<AnimalDatabase>(
        query,
        client_id
      );
    } catch (error) {
      throw error;
    }
  }

  return { generatePdf };
}
