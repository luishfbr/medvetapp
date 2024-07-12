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
  BudgetDatabase,
  ClientDatabase,
  useAnimalDatabase,
  useBudgetDatabase,
  useClientDatabase,
} from "@/database/useClientDatabase";

import { printToFileAsync } from "expo-print"
import { shareAsync } from 'expo-sharing'

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
      setClient(clientDetails); // Atualiza o estado com os detalhes do cliente
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

      const animalsResponse = await (await animalDatabase).searchAnimalsByIdClient(Number(client_id));

      const animals = animalsResponse.data.map(animal => ({
        client_id: animal.client_id,
        idAnimal: animal.idAnimal,
        name: animal.name,
      }));

      for (const animal of animals) {
        console.log(`Animal ID: ${animal.idAnimal}, Nome: ${animal.name}`);

        // Consulta o orçamento para o animal atual
        const budgetResponse = await (await budgetDatabase).searchBudgetByIdAnimal(animal.idAnimal);
        const budgets = budgetResponse.data;

        console.log(`Orçamentos para Animal ID ${animal.idAnimal}:`, budgets);

        // Aqui você pode processar os orçamentos conforme necessário
      }

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

    // Mostrar o modal de confirmação antes de salvar os dados
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

    // Fechar o modal após salvar os dados
    setConfirmModalVisible(false);
  }

  function cancelCreateOrUpdate() {
    // Apenas fechar o modal sem salvar os dados
    setConfirmModalVisible(false);
  }

  function handleDeleteClient(idAnimal: number) {
    // Mostrar o modal de delete antes de deletar o cliente
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
        <Pressable>
          <AppButton title="Gerar Relatório" onPress={createPdf}></AppButton>
        </Pressable>
        <Text style={styles.text_header}>
          {client ? client.name : "Carregando..."}
        </Text>
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
