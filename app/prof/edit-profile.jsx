import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,Image,Dimensions,ScrollView,StyleSheet,Platform,ActionSheetIOS,Alert,} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PROFILE_SIZE = Math.max(90, Math.min(140, SCREEN_WIDTH * 0.28)); // Responsive profile size

export default function EditProfileScreen() {
  const router = useRouter();

  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSave = () => {
    try {
      console.log("Profile saved:", {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        birthDate,
        gender,
        profilePicture,
      });
      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  // Profile picture upload logic
  const handleProfilePictureUpload = async () => {
    const openCamera = async () => {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) setProfilePicture(result.assets[0].uri);
    };

    const openGallery = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) setProfilePicture(result.assets[0].uri);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      Alert.alert(
        "Profile Picture",
        "Choose an option",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Take Photo", onPress: openCamera },
          { text: "Choose from Gallery", onPress: openGallery },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profilePictureWrapper}>
          <View
            style={[
              styles.profilePictureContainer,
              { width: PROFILE_SIZE, height: PROFILE_SIZE },
            ]}
          >
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={[
                  styles.profilePicture,
                  {
                    width: PROFILE_SIZE,
                    height: PROFILE_SIZE,
                    borderRadius: PROFILE_SIZE / 2,
                  },
                ]}
              />
            ) : (
              <Image
                source={require("./../../assets/images/profile.jpg")}
                style={[
                  styles.profilePicture,
                  {
                    width: PROFILE_SIZE,
                    height: PROFILE_SIZE,
                    borderRadius: PROFILE_SIZE / 2,
                  },
                ]}
              />
            )}
            {/* Mirrored Edit (✏️) Button */}
            <TouchableOpacity
              style={[
                styles.editButton,
                {
                  right: -PROFILE_SIZE * 0.1,
                  bottom: 0,
                },
              ]}
              onPress={handleProfilePictureUpload}
              activeOpacity={0.7}
            >
              <View style={styles.editCircle}>
                <Text style={styles.editEmojiMirrored}>✏️</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Container */}
        <View
          style={[
            styles.formContainer,
            {
              width: SCREEN_WIDTH > 500 ? 400 : "90%",
              marginTop: -PROFILE_SIZE / 2.2, // Overlap the profile picture
              paddingTop: PROFILE_SIZE / 2 + 16,
            },
          ]}
        >
          {/* Title */}
          <Text style={styles.title}>Edit Profile</Text>

          {/* First Name Field */}
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor="#FFFFFF"
          />

          {/* Last Name Field */}
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor="#FFFFFF"
          />

          {/* Username Field */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#FFFFFF"
          />

          {/* Email Field */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#FFFFFF"
            keyboardType="email-address"
          />

          {/* Phone Number Field */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            placeholderTextColor="#FFFFFF"
            keyboardType="phone-pad"
          />

          {/* Birth Date Field */}
          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}
          >
            <Text style={styles.datePickerText}>
              {birthDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Gender Field */}
          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>

          {/* Save and Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 0,
    paddingTop: 40,
  },
  profilePictureWrapper: {
    width: "100%",
    alignItems: "center",
    zIndex: 2,
    marginBottom: 0,
    marginTop: 20,
  },
  profilePictureContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 3,
  },
  profilePicture: {
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#eee",
    zIndex: 2,
  },
  editButton: {
    position: "absolute",
    zIndex: 4,
  },
  editCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  editEmojiMirrored: {
    fontSize: 20,
    color: "#fff",
    transform: [{ scaleX: -1 }],
  },
  formContainer: {
    backgroundColor: "#513FF3",
    padding: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Outfit",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Outfit",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    color: "#FFFFFF",
    fontFamily: "Outfit",
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  datePickerText: {
    color: "#FFFFFF",
    fontFamily: "Outfit",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    color: "#FFFFFF",
    fontFamily: "Outfit",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#3498db", // Updated color
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#3498db", // Updated color
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Outfit",
  },
});
