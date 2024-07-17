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

  async function getAnimalsAndBudgets(id: number) {
    try {
      const queryAnimal = "SELECT * FROM animals WHERE client_id = ?";
      const responseAnimal = await database.getAllAsync<AnimalDatabase>(
        queryAnimal,
        id
      );

      const queryClient = "SELECT * FROM clients WHERE id = ?";
      const reponseClient = await database.getAllAsync<ClientDatabase>(
        queryClient,
        id
      );

      console.log(queryAnimal);
      console.log(queryClient);

      if (responseAnimal) {
        for (const animal of responseAnimal) {
          const budgetQuery = "SELECT * FROM budget WHERE animal_id = ?";
          const budgetResponse = await database.getAllAsync<BudgetDatabase>(
            budgetQuery,
            animal.idAnimal
          );

          console.log(budgetResponse);

          return { responseAnimal, budgetResponse, reponseClient };
        }
      }
    } catch (error) {
      throw error;
    }
  }

  return { create, searchByName, update, remove, show, getAnimalsAndBudgets };
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

  async function searchAnimalsByIdClient(client_id: number) {
    try {
      const query = "SELECT * FROM animals WHERE client_id = ?";
      const response = await database.getAllAsync<AnimalDatabase>(
        query,
        client_id
      );

      const detailsWithIndex = {
        data: response.map((animal) => ({
          client_id: animal.client_id,
          idAnimal: animal.idAnimal,
          name: animal.name,
        })),
      };

      return detailsWithIndex;
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
    searchAnimalsByIdClient,
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

  async function searchBudgetByIdAnimal(animal_id: number) {
    try {
      const queryAnimal = "SELECT * FROM animals WHERE idAnimal = ?";
      const responseAnimal = await database.getFirstAsync<AnimalDatabase>(
        queryAnimal,
        animal_id
      );

      const query = "SELECT * FROM budget WHERE animal_id = ?";
      const response = await database.getAllAsync<BudgetDatabase>(
        query,
        animal_id
      );

      const totalAmountPaid = response.reduce(
        (acc, budget) => acc + budget.amountPaid,
        0
      );
      const totalValue = response.reduce(
        (acc, budget) => acc + budget.value,
        0
      );

      const detailsBudgetWithIndex = {
        data: response,
        totalAmountPaid,
        totalValue,
        animalName: responseAnimal ? responseAnimal.name : null,
      };

      return detailsBudgetWithIndex;
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
    searchBudgetByIdAnimal,
  };
}
