import { useEffect, useState } from "react";
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { Input } from "@/app/components/Input";
import { Client } from "@/app/components/Client";

import {
  ClientDatabase,
  useClientDatabase,
} from "@/database/useClientDatabase";
import AppButton from "./components/Button";

import styles from "@/app/styles/style"

export default function Index() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<ClientDatabase[]>([]);

  const clientDatabase = useClientDatabase();

  async function create() {
    try {
      if (!name || !owner) {
        Alert.alert("É necessário inserir os dados")
        return
      }

      const response = await (
        await clientDatabase
      ).create({
        name,
        owner,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function update() {
    try {
      const response = await (
        await clientDatabase
      ).update({
        id: Number(id),
        name,
        owner: owner,
      });

      Alert.alert("Cliente atualizado!");
    } catch (error) {
      console.log(error);
    }
  }

  async function list() {
    try {
      const response = await (await clientDatabase).searchByName(search);
      setClients(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function remove(id: number) {
    try {
      await (await clientDatabase).remove(id);
      await list();
    } catch (error) {
      console.log(error);
    }
  }

  function details(item: ClientDatabase) {
    setId(String(item.id));
    setName(item.name);
    setOwner(item.owner);
  }

  async function handleSave() {
    if (id) {
      update();
    } else {
      create();
    }

    setId("");
    setName("");
    setOwner("");
    await list();
  }

  useEffect(() => {
    list();
  }, [search]);

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>Lista de Clientes</Text>
    </View>
  );

  const ListFooter = () => {
    <View style={styles.listFooter}>
        <Text></Text>
    </View>
  }

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Meus Clientes</Text>
      </View>

      <View style={styles.divform}>
        <View style={styles.form}>
          <Text style={styles.text_form}>Registre um novo Cliente</Text>
          <View style={styles.form_inputs}>
            <Input
              style={styles.input}
              placeholder="Nome da Fazenda"
              onChangeText={setName}
              value={name}
            ></Input>
            <Input
              style={styles.input}
              placeholder="Nome do Proprietário"
              onChangeText={setOwner}
              value={owner}
            ></Input>
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
            data={clients}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Client
                data={item}
                onOpen={() => details(item)}
                onDelete={() => remove(item.id)}
                onPress={() => router.navigate("/details/" + item.id)}
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