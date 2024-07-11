import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Alert, View, Text, FlatList } from "react-native";

import AppButton from "@/app/components/Button";
import { Animal } from "@/app/components/Animal";
import { Input } from "@/app/components/Input";

import {
  AnimalDatabase,
  ClientDatabase,
  useAnimalDatabase,
  useClientDatabase,
} from "@/database/useClientDatabase";

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
  const router = useRouter();

  async function fetchClientDetails() {
    try {
      const clientDetails = await (await clientDatabase).show(Number(id));
      setClient(clientDetails); // Atualiza o estado com os detalhes do cliente
    } catch (error) {
      console.log(error);
    }
  }

  async function createAnimal() {
    try {
      if (!name) {
        Alert.alert("Insira o nome do animal");
        return;
      }

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
      await searchAnimal(); // Atualiza a lista de animais após a remoção
    } catch (error) {
      console.log(error);
    }
  }

  function animalsdetails(item: AnimalDatabase) {
    setId(String(item.idAnimal));
    setName(item.name);
  }

  async function handleSave() {
    if (idAnimal) {
      await updateAnimal();
    } else {
      await createAnimal();
    }

    setId("");
    setName("");
    await searchAnimal();
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

  return (
    <View style={styles.main}>
      <View style={styles.header}>
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
            data={animals}
            keyExtractor={(item) => String(item.idAnimal)}
            renderItem={({ item }) => (
              <Animal
                data={item}
                onOpen={() => animalsdetails(item)}
                onDelete={() => removeAnimal(item.idAnimal)}
                onPress={() => router.navigate("/budget/" + item.idAnimal)}
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
