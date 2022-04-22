import React, { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, SafeAreaView, Text, View, StyleSheet, TextInput } from "react-native";

import TaskContext, { Subtask } from "./app/models/Schemas";
import SubtaskListDefaultText from "./app/components/SubtaskListDefaultText";
import AddSubtaskButton from "./app/components/AddSubtaskButton";
import NewReminderTitlebar from "./app/components/NewReminderTitlebar";
import ReminderContent from "./app/components/ReminderContent";
import colors from "./app/styles/colors";

const { useRealm, useQuery, RealmProvider } = TaskContext;

function App() {
  const realm = useRealm();
  const result = useQuery(Subtask);
  const subtasks = useMemo(() => result.sorted("isComplete"), [result]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputFeature, setInputFeature] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleAddSubtask = useCallback(
    (_title: string, _feature: string, _value: string): void => {
      // Everything in the function passed to "realm.write" is a transaction and will
      // hence succeed or fail together. A transcation is the smallest unit of transfer
      // in Realm so we want to be mindful of how much we put into one single transaction
      // and split them up if appropriate (more commonly seen server side). Since clients
      // may occasionally be online during short time spans we want to increase the probability
      // of sync participants to successfully sync everything in the transaction, otherwise
      // no changes propagate and the transaction needs to start over when connectivity allows.
      realm.write(() => {
        const subtask = realm.create("Subtask", Subtask.generate(_title, _feature, _value));
        // handleModifySubtask(subtask._objectId());
      });
    },
    [realm],
  );

  const handleModifySubtask = useCallback(
    (subtask: Subtask, _title?: string, _feature?: string, _value?: string): void => {
      realm.write(() => {
        // Normally when updating a record in a NoSQL or SQL database, we have to type
        // a statement that will later be interpreted and used as instructions for how
        // to update the record. But in RealmDB, the objects are "live" because they are
        // actually referencing the object's location in memory on the device (memory mapping).
        // So rather than typing a statement, we modify the object directly by changing
        // the property values. If the changes adhere to the schema, Realm will accept
        // this new version of the object and wherever this object is being referenced
        // locally will also see the changes "live".
        _title? subtask.title = _title : {};
        _feature? subtask.feature = _feature : {};
        _value? subtask.value = _value : {};
      });

      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      // realm?.write(() => {
      //   const task = realm?.objectForPrimaryKey('Task', id); // If the ID is passed as an ObjectId
      //   const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
      //   task.isComplete = !task.isComplete;
      // });
    },
    [realm],
  );

  const handleDeleteSubtask = useCallback(
    (task: Subtask): void => {
      realm.write(() => {
        realm.delete(task);

        // Alternatively if passing the ID as the argument to handleDeleteTask:
        // realm?.delete(realm?.objectForPrimaryKey('Task', id));
      });
    },
    [realm],
  );

  return (
    <SafeAreaView style={styles.screen}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Title: </Text>
                <TextInput
                  value={inputTitle}
                  onChangeText={setInputTitle}
                  placeholder="Enter new task title"
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Feature: </Text>
                <TextInput
                  value={inputFeature}
                  onChangeText={setInputFeature}
                  placeholder="Add a feature"
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Value: </Text>
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Add a feature value"
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  handleAddSubtask(inputTitle, inputFeature, inputValue);
                }}
              >
                <Text style={styles.textStyle}>Done ✓</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
      <NewReminderTitlebar onSubmit={() => {}}></NewReminderTitlebar>
      <View style={styles.content}>
        {subtasks.length === 0 ? (
          <SubtaskListDefaultText />
        ) : (
          <ReminderContent subtasks={subtasks} onDeleteSubtask={handleDeleteSubtask} />
        )}
        <AddSubtaskButton onSubmit={() => setModalVisible(true)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalRow: {
    flex: 1,
    flexDirection: "row"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

function AppWrapper() {
  if (!RealmProvider) {
    return null;
  }
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
}

export default AppWrapper;
