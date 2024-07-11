import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Alert, StyleSheet, Button, FlatList } from "react-native";

import { Input } from "../components/Input";
import { BudgetComponent } from "@/app/components/BudgetComponent";
import {
  AnimalDatabase,
  BudgetDatabase,
  useAnimalDatabase,
  useBudgetDatabase,
} from "@/database/useClientDatabase";

import styles from "@/app/styles/style";
import AppButton from "../components/Button";

export default function Budget() {
  const [idBudget, setIdBudget] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [budget, setBudget] = useState<BudgetDatabase[]>([]);
  const [animal, setAnimal] = useState<AnimalDatabase | null>(null);
  const [search, setSearch] = useState("");

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
      if (!date || !description || !value || !amountPaid) {
        Alert.alert("Está faltando algum valor");
        return;
      }

      const response = await (
        await budgetDatabase
      ).createBudget({
        date,
        description,
        value,
        amountPaid,
        animal_id: Number(idAnimal),
      });
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
        value,
        amountPaid,
        animal_id: Number(idAnimal),
      });
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
    setValue(item.value);
    setAmountPaid(item.amountPaid);
  }

  async function handleSave() {
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

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.text_header}>
          {animal ? animal.name : "Carregando..."}
        </Text>
      </View>
      <View style={styles.divform}>
        <View style={styles.form}>
          <Text style={styles.text_form}>Registre os gastos</Text>
          <View style={styles.form_inputs}>
            <Input
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
            <Input
              style={styles.input}
              placeholder="Valor passado ao cliente"
              onChangeText={setValue}
              value={value}
            />
            <Input
              style={styles.input}
              placeholder="Valor pago pelo cliente"
              onChangeText={setAmountPaid}
              value={amountPaid}
            />
            <AppButton title="Salvar" onPress={handleSave}></AppButton>
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
                onDelete={() => removeBudget(item.idBudget)}
              />
            )}
            style={styles.list}
            ListHeaderComponent={ListHeader}
          />
        </View>
      </View>
    </View>
  );
}