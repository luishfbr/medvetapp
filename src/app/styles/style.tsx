import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    height: "auto",
    width: "auto",
  },

  container: {
    flex: 1,
    paddingBottom: 10,
  },

  header: {
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },

  text_header: {
    color: "white",
    padding: 10,
    fontSize: 45,
    fontWeight: "bold",
  },

  divform: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  form: {
    margin: 40,
  },

  text_form: {
    fontSize: 30,
    marginBottom: 30,
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  form_inputs: {
    gap: 20,
  },

  text_line: {
    fontSize: 3,
  },

  input: {
    borderRadius: 10,
    height: 60,
    width: 560,
    fontSize: 22,
    paddingVertical: "auto",
    paddingHorizontal: 35,
    borderWidth: 2,
    borderColor: "#D8D8D8",
    backgroundColor: "#F5F5F5", // Corrigido para uma cor hexadecimal válida
  },

  line: {
    backgroundColor: "#CCC",
    height: 4,
    marginBottom: 20,
  },

  listview: {
    justifyContent: "center",
    gap: 2,
    flex: 1, // Make the listview take up remaining space
  },

  list: {
    marginHorizontal: 5,
  },

  listHeader: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    borderRadius: 10,
  },

  listHeaderBudget: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  listHeaderText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    padding: 6,
  },

  listHeaderTextLeft: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    padding: 6,
    marginLeft: 50,
  },

  listHeaderTextRight: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    padding: 6,
    marginRight: 90,
  },

  listFooter: {
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    height: 30,
    borderRadius: 10,
    marginTop: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 2,
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },

  buttonClose: {
    backgroundColor: "red",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
  },

  viewbuttonspopup: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },

  buttonConfirm: {
    backgroundColor: "green",
  },

  portraitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});

export default styles;
