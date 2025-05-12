import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MAX_WIDTH = 500;

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const name = params.name || "Unknown";
  const details = params.details || "No details available";

  // Parse details string: "Service Name | Cost | Location"
  const [serviceRaw, costRaw, locationRaw] = details
    .split("|")
    .map((s) => s.trim()); 
  // Determine icon
  const isFuel = /fuel/i.test(serviceRaw);
  const serviceIcon = isFuel ? "⛽" : "🔧";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.provider}>{name}</Text>
          <View style={styles.innerSeparator} />
          <Text style={styles.serviceName}>
            {serviceIcon} {serviceRaw}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Date:</Text>{" "}
            <Text style={styles.detailValue}>12th May 2025</Text>
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Location:</Text>{" "}
            <Text style={styles.detailValue}>{locationRaw}</Text>
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.detailLabel}>💰 Cost:</Text>{" "}
            <Text style={styles.cost}>{costRaw}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: SCREEN_WIDTH > 500 ? 32 : 16,
    alignItems: "center",
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
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: SCREEN_WIDTH > 500 ? 32 : 16,
  },
  card: {
    backgroundColor: "#E3F0FF",
    borderRadius: 15,
    padding: SCREEN_WIDTH > 500 ? 32 : 18,
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    width: SCREEN_WIDTH > CARD_MAX_WIDTH ? CARD_MAX_WIDTH : "100%",
    maxWidth: CARD_MAX_WIDTH,
  },
  provider: {
    fontSize: SCREEN_WIDTH > 400 ? 20 : 18,
    fontWeight: "600", // Outfit SemiBold
    fontFamily: "Outfit",
    color: "#000",
    marginBottom: 10,
    letterSpacing: -0.5,
    textAlign: "left",
  },
  innerSeparator: {
    height: 1,
    backgroundColor: "#888", // black-gray
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 1,
  },
  serviceName: {
    fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
    fontWeight: "500", // Outfit Medium
    fontFamily: "Outfit",
    color: "#000",
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  detailRow: {
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    fontWeight: "400", // Outfit Regular
    fontFamily: "Outfit",
    color: "#666666",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  detailLabel: {
    fontWeight: "400",
    fontFamily: "Outfit",
    color: "#666666",
  },
  detailValue: {
    fontWeight: "400",
    fontFamily: "Outfit",
    color: "#666666",
  },
  cost: {
    fontWeight: "500", // Outfit Medium
    fontFamily: "Outfit",
    color: "#4CAF50",
  },
});