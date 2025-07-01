import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { createComplaint } from "../../service/rideService";

const AddComplaint = () => {
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const animateModal = () => {
    scaleValue.setValue(0);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Validation Error", "Please enter your complaint.");
      return;
    }

    try {
      await createComplaint(message);
      setMessage("");
      setModalVisible(true);
      animateModal();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View className="bg-white rounded-xl shadow-lg p-6">
          <Text className="text-3xl font-JakartaBold text-center text-blue-500 mb-6">
            Submit a Complaint
          </Text>

          <Text className="text-lg font-JakartaMedium text-blue-600 mb-2">
            Your Message
          </Text>
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Describe your issue here..."
            placeholderTextColor="#a1a1aa"
            value={message}
            onChangeText={setMessage}
            className="border border-blue-300 rounded-lg p-4 text-gray-800 text-base mb-6 shadow-sm bg-blue-50 font-JakartaMedium"
            style={{ textAlignVertical: "top" }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            className="bg-blue-600 rounded-lg py-4 shadow-md"
          >
            <Text className="text-white text-center text-xl font-JakartaBold">
              Send Complaint
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Popup */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40 px-8">
          <Animated.View
            style={{ transform: [{ scale: scaleValue }] }}
            className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg"
          >
            <Text className="text-2xl font-JakartaMedium text-center mb-4 text-blue-600">
              🎉 Complaint Submitted!
            </Text>
            <Text className="text-center font-JakartaLight text-gray-600 mb-6">
              Thank you for your feedback. We will address your complaint as
              soon as possible.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-JakartaSemiBold text-lg">
                Close
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AddComplaint;
