import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Alert, FlatList, Pressable } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import { Input } from "../components/Input";
import { BudgetComponent } from "@/app/components/BudgetComponent";
import {
  AnimalDatabase,
  BudgetDatabase,
  useAnimalDatabase,
  useBudgetDatabase,
} from "@/database/useClientDatabase";

import ConfirmationModal from "@/app/components/popups/ConfirmationModal";
import DeleteModal from "@/app/components/popups/DeleteModal";

import styles from "@/app/styles/style";
import AppButton from "../components/Button";

export default function Budget() {
  const [idBudget, setIdBudget] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [budget, setBudget] = useState<BudgetDatabase[]>([]);
  const [animal, setAnimal] = useState<AnimalDatabase | null>(null);
  const [search, setSearch] = useState<string>("");

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const { idAnimal } = useLocalSearchParams();
  const animalDatabase = useAnimalDatabase();
  const budgetDatabase = useBudgetDatabase();
  const router = useRouter();

  async function fetchAnimalDetails() {
    try {
      const animalDetails = await (
        await animalDatabase
      ).showAnimals(Number(idAnimal));
      setAnimal(animalDetails);
    } catch (error) {
      console.log(error);
    }
  }

  async function createBudget() {
    try {
      const response = await (
        await budgetDatabase
      ).createBudget({
        date,
        description,
        value: parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')),
        amountPaid: parseFloat(amountPaid.replace(/[^\d,-]/g, '').replace(',', '.')),
        animal_id: Number(idAnimal),
      });
      await searchBudget();
    } catch (error) {
      console.log(error);
    }
  }

  async function updateBudget() {
    try {
      const response = await (
        await budgetDatabase
      ).updateBudget({
        idBudget: Number(idBudget),
        date,
        description,
        value: parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')),
        amountPaid: parseFloat(amountPaid.replace(/[^\d,-]/g, '').replace(',', '.')),
        animal_id: Number(idAnimal),
      });
      await searchBudget();
    } catch (error) {
      console.log(error);
    }
  }

  async function searchBudget() {
    try {
      const response = await (
        await budgetDatabase
      ).searchBudgetByDescription(search, Number(idAnimal));
      setBudget(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeBudget(idBudget: number) {
    try {
      await (await budgetDatabase).removeBudget(idBudget);
      await searchBudget();
    } catch (error) {
      console.log(error);
    }
  }

  function budgetDetails(item: BudgetDatabase) {
    setIdBudget(String(item.idBudget));
    setDate(item.date);
    setDescription(item.description);
    setValue(item.value.toFixed(2).replace('.', ',')); // Formatar o valor para exibição
    setAmountPaid(item.amountPaid.toFixed(2).replace('.', ',')); // Formatar o valor pago para exibição
  }

  async function handleSave() {
    if (!date || !description || !value || !amountPaid) {
      Alert.alert("É necessário inserir os dados");
      return;
    }

    // Mostrar o modal de confirmação antes de salvar os dados
    setConfirmModalVisible(true);
  }

  async function confirmCreateOrUpdate() {
    if (idBudget) {
      await updateBudget();
    } else {
      await createBudget();
    }

    setIdBudget("");
    setDate("");
    setDescription("");
    setValue("");
    setAmountPaid("");
    await searchBudget();

    // Fechar o modal após salvar os dados
    setConfirmModalVisible(false);
  }

  function cancelCreateOrUpdate() {
    // Apenas fechar o modal sem salvar os dados
    setConfirmModalVisible(false);
  }

  function handleDeleteClient(idBudget: number) {
    // Mostrar o modal de delete antes de deletar o cliente
    setClientToDelete(idBudget);
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    if (clientToDelete !== null) {
      await removeBudget(clientToDelete);
    }
    setDeleteModalVisible(false);
  }

  function cancelDelete() {
    setDeleteModalVisible(false);
  }

  useEffect(() => {
    fetchAnimalDetails();
  }, [idAnimal]);

  useEffect(() => {
    searchBudget();
  }, [search]);

  const ListHeader = () => {
    return (
      <View style={styles.listHeaderBudget}>
        <Text style={styles.listHeaderTextLeft}>Data</Text>
        <Text style={styles.listHeaderText}>Descrição</Text>
        <Text style={styles.listHeaderText}>Valor</Text>
        <Text style={styles.listHeaderTextRight}>Valor Pago</Text>
      </View>
    );
  };

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
        message="Salvar dados na planilha de gastos?"
      />
      <DeleteModal
        visible={deleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Você deseja excluir esta linha?"
      />
      <View style={styles.header}>
        <Text style={styles.text_header}>
          {animal ? animal.name : "Carregando..."}
        </Text>
      </View>
      <View style={styles.divform}>
        <View style={styles.form}>
          <Text style={styles.text_form}>Registre os gastos</Text>
          <View style={styles.form_inputs}>
            <TextInputMask
              type={"datetime"}
              options={{
                format: "DD/MM/YYYY",
              }}
              style={styles.input}
              placeholder="Data da visita"
              onChangeText={setDate}
              value={date}
            />
            <Input
              style={styles.input}
              placeholder="Descrição"
              onChangeText={setDescription}
              value={description}
            />
            <TextInputMask
              type={"money"}
              options={{
                precision: 2,
                separator: ",",
                delimiter: ".",
                unit: "R$",
                suffixUnit: "",
              }}
              style={styles.input}
              placeholder="Valor passado ao cliente"
              onChangeText={setValue}
              value={value}
            />
            <TextInputMask
              type={"money"}
              options={{
                precision: 2,
                separator: ",",
                delimiter: ".",
                unit: "R$",
                suffixUnit: "",
              }}
              style={styles.input}
              placeholder="Valor pago pelo cliente"
              onChangeText={setAmountPaid}
              value={amountPaid}
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
            data={budget}
            keyExtractor={(item) => String(item.idBudget)}
            renderItem={({ item }) => (
              <BudgetComponent
                data={item}
                onPress={() => budgetDetails(item)}
                onDelete={() => handleDeleteClient(item.idBudget)}
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
