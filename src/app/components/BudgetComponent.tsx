import {
  Pressable,
  PressableProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
  data: {
    date: string;
    description: string;
    value: string;
    amountPaid: string;
  };
  onDelete: () => void;
};

export function BudgetComponent({ data, onDelete, ...rest }: Props) {
  return (
    <Pressable
      style={{
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D8D8D8",
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 3,
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      {...rest}
    >
      <Text style={{ flex: 1, fontSize: 22, textAlign: "center" }}>
        {data.date}
      </Text>
      <Text style={{ flex: 1, fontSize: 22, textAlign: "center" }}>
        {data.description}
      </Text>
      <Text style={{ flex: 1, fontSize: 22, textAlign: "center" }}>
        {data.value}
      </Text>
      <Text style={{ flex: 1, fontSize: 22, textAlign: "center" }}>
        {data.amountPaid}
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
