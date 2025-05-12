import { View, FlatList, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState([
    {
      id: "1",
      name: "ABC Garage",
      details: "Spark Plug Replacement | Rs. 1000/- | New Delhi",
    },
    {
      id: "2",
      name: "XYZ Fuel Station",
      details: "Fuel Refill | Rs. 500/- | Mumbai",
    },
    {
      id: "3",
      name: "RM Garage",
      details: "Oil Change | Rs. 800/- | Bangalore",
    },
  ]);

  const clearHistory = () => {
    setHistory([]);
    console.log("History Cleared");
  };

  const deleteEntry = (id) => {
    setHistory(history.filter((entry) => entry.id !== id));
    console.log(`Entry ${id} deleted`);
  };

  const getIcon = (name) => {
    if (/fuel station/i.test(name)) return "⛽";
    if (/garage/i.test(name)) return "🔧";
    return "";
  };

  return (
    <View style={styles.outer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>History</Text>
      </View>

      <View style={styles.container}>
        {/* History List */}
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>
                {getIcon(item.name)} {item.name}
              </Text>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { name: item.name, details: item.details },
                  })
                }
              >
                <Text style={styles.moreButtonText}>More</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteEntry(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Clear All Button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: "100%",
    backgroundColor: "#3498db",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop:20,
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH > 500 ? 500 : "96%",
    maxWidth: 500,
    padding: SCREEN_WIDTH > 400 ? 24 : 12,
    paddingTop: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: SCREEN_WIDTH > 400 ? 18 : 12,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 18 : 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyText: {
    fontSize: SCREEN_WIDTH > 400 ? 17 : 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  moreButton: {
    backgroundColor: "#3498db",
    paddingVertical: SCREEN_WIDTH > 400 ? 8 : 6,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 14 : 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  moreButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: SCREEN_WIDTH > 400 ? 15 : 13,
  },
  deleteButton: {
    backgroundColor: "#3498db",
    paddingVertical: SCREEN_WIDTH > 400 ? 8 : 6,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 14 : 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: SCREEN_WIDTH > 400 ? 15 : 13,
  },
  clearButton: {
    backgroundColor: "#3498db",
    paddingVertical: SCREEN_WIDTH > 400 ? 16 : 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: SCREEN_WIDTH > 400 ? 17 : 15,
  },
});