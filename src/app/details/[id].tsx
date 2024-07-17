import { useEffect, useState } from "react";
import { Alert, View, Text, FlatList, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Animal } from "@/app/components/Animal";
import { Input } from "@/app/components/Input";

import AppButton from "@/app/components/Button";
import ConfirmationModal from "@/app/components/popups/ConfirmationModal";
import DeleteModal from "@/app/components/popups/DeleteModal";

import {
  AnimalDatabase,
  ClientDatabase,
  useAnimalDatabase,
  useBudgetDatabase,
  useClientDatabase,
} from "@/database/useClientDatabase";

import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

import styles from "@/app/styles/style";

export default function Details() {
  const [idAnimal, setId] = useState("");
  const [name, setName] = useState("");
  const [animals, setAnimals] = useState<AnimalDatabase[]>([]);
  const [client, setClient] = useState<ClientDatabase | null>(null);

  const [search, setSearch] = useState("");

  const { id } = useLocalSearchParams();
  const clientDatabase = useClientDatabase();
  const animalDatabase = useAnimalDatabase();
  const budgetDatabase = useBudgetDatabase();
  const router = useRouter();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  async function fetchClientDetails() {
    try {
      const clientDetails = await (await clientDatabase).show(Number(id));
      setClient(clientDetails);
    } catch (error) {
      console.log(error);
    }
  }

  async function createPdf() {
    try {
      const client = await (await clientDatabase).show(Number(id));

      if (!client) {
        throw new Error(`Cliente com ID ${id} não encontrado.`);
      }

      const client_id = client.id;

      const animalsResponse = await (
        await animalDatabase
      ).searchAnimalsByIdClient(Number(client_id));

      const animals = animalsResponse.data.map((animal) => ({
        client_id: animal.client_id,
        idAnimal: animal.idAnimal,
        name: animal.name,
      }));

      let html = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { text-align: center; }
            .client-info, .animal-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Relatório do Cliente</h1>
          <div class="client-info">
            <h2>Informações do Cliente</h2>
            <p><strong>Nome:</strong> ${client.name}</p>
            <p><strong>Proprietário:</strong> ${client.owner}</p>
          </div>
      `;

      for (const animal of animals) {
        const budgetResponse = await (
          await budgetDatabase
        ).searchBudgetByIdAnimal(animal.idAnimal);
        const budgets = budgetResponse.data.map((budget) => ({
          date: budget.date,
          description: budget.description,
          value: budget.value,
          amountPaid: budget.amountPaid,
        }));

        const totalAmountPaid = budgetResponse.totalAmountPaid;
        const totalValue = budgetResponse.totalValue;

        html += `
          <div class="animal-info">
            <h1>Animal: ${animal.name}</h1>
            <table>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Valor Pago</th>
              </tr>
        `;

        for (const budget of budgets) {
          html += `
            <tr>
              <td>${budget.date}</td>
              <td>${budget.description}</td>
              <td>${budget.value}</td>
              <td>${budget.amountPaid}</td>
            </tr>
          `;
        }

        html += `
            <tr>
              <td colspan="2"><strong>Total</strong></td>
              <td><strong>${totalValue}</strong></td>
              <td><strong>${totalAmountPaid}</strong></td>
            </tr>
            </table>
          </div>
        `;
      }

      html += `
          </body>
        </html>
      `;

      const file = await printToFileAsync({
        html: html,
        base64: false,
      });

      await shareAsync(file.uri);
    } catch (error) {
      throw error;
    }
  }

  async function createAnimal() {
    try {
      const response = await (
        await animalDatabase
      ).createAnimal({
        name,
        client_id: Number(id),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAnimal() {
    try {
      const response = await (
        await animalDatabase
      ).updateAnimal({
        idAnimal: Number(idAnimal),
        name,
        client_id: Number(id),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function searchAnimal() {
    try {
      const response = await (
        await animalDatabase
      ).searchAnimalByName(search, Number(id));
      setAnimals(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeAnimal(id: number) {
    try {
      await (await animalDatabase).removeAnimal(id);
      await searchAnimal();
    } catch (error) {
      console.log(error);
    }
  }

  function animalsdetails(item: AnimalDatabase) {
    setId(String(item.idAnimal));
    setName(item.name);
  }

  async function handleSave() {
    if (!name) {
      Alert.alert("Insira o nome do animal");
      return;
    }
    setConfirmModalVisible(true);
  }

  async function confirmCreateOrUpdate() {
    if (idAnimal) {
      await updateAnimal();
    } else {
      await createAnimal();
    }

    setId("");
    setName("");
    await searchAnimal();
    setConfirmModalVisible(false);
  }

  function cancelCreateOrUpdate() {
    setConfirmModalVisible(false);
  }

  function handleDeleteClient(idAnimal: number) {
    setClientToDelete(idAnimal);
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    if (clientToDelete !== null) {
      await removeAnimal(clientToDelete);
    }
    setDeleteModalVisible(false);
  }

  function cancelDelete() {
    setDeleteModalVisible(false);
  }

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  useEffect(() => {
    searchAnimal();
  }, [search]);

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>Lista de Animais</Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.listFooter}>
      <Text></Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <ConfirmationModal
        visible={confirmModalVisible}
        onConfirm={confirmCreateOrUpdate}
        onCancel={cancelCreateOrUpdate}
        message="Você deseja salvar o animal?"
      />
      <DeleteModal
        visible={deleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Você deseja excluir o animal?"
      />
      <View style={styles.header}>
        <Text style={styles.text_header}>
          {client ? client.name : "Carregando..."}
        </Text>
        <Pressable>
          <AppButton title="Gerar Relatório" onPress={createPdf}></AppButton>
        </Pressable>
      </View>
      <View style={styles.divform}>
        <View style={styles.form}>
          <Text style={styles.text_form}>Registrar um novo Animal</Text>
          <View style={styles.form_inputs}>
            <Input
              style={styles.input}
              placeholder="Nome do Animal"
              onChangeText={setName}
              value={name}
            />
            <Pressable>
              <AppButton title="Salvar" onPress={handleSave}></AppButton>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.line}>
        <Text style={styles.text_line}></Text>
      </View>
      <View style={styles.divform}>
        <View style={styles.form}>
          <View style={styles.form_inputs}>
            <Input
              style={styles.input}
              placeholder="Pesquisar"
              onChangeText={setSearch}
            />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.listview}>
          <FlatList
            data={animals}
            keyExtractor={(item) => String(item.idAnimal)}
            renderItem={({ item }) => (
              <Animal
                data={item}
                onOpen={() => animalsdetails(item)}
                onDelete={() => handleDeleteClient(item.idAnimal)}
                onPress={() => router.navigate("/budget/" + item.idAnimal)}
              />
            )}
            style={styles.list}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
          />
        </View>
      </View>
    </View>
  );
}
