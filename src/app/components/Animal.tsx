import {
  Pressable,
  PressableProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
  data: {
    name: string;
  };
  onDelete: () => void;
  onOpen: () => void;
};

export function Animal({ data, onDelete, onOpen, ...rest }: Props) {
  return (
    <Pressable
      style={{
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D8D8D8",
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      {...rest}
    >
      <TouchableOpacity onPress={onOpen}>
        <MaterialIcons
          style={{ marginLeft: 30 }}
          name="edit"
          size={35}
          color="#1E1E1E"
        />
      </TouchableOpacity>

      <Text style={{ flex: 1, fontSize: 22, textAlign: "center" }}>
        {data.name}
      </Text>

      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons
          style={{ marginRight: 30 }}
          name="delete"
          size={35}
          color="#1E1E1E"
        />
      </TouchableOpacity>
    </Pressable>
  );
}
