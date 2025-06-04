import React, { useState } from "react";
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
} from "react-native";

interface AddComplaintProps {
  userId: string;
}

const AddComplaint = ({ userId }: AddComplaintProps) => {
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = new Animated.Value(0);

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
      alert("Please enter your complaint.");
      return;
    }

    try {
      const res = await fetch("http://192.168.0.104:3000/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, message }),
      });

      if (!res.ok) throw new Error("Failed to submit complaint");

      setMessage("");
      setModalVisible(true);
      animateModal();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
        <View className="bg-white rounded-xl shadow-lg p-6">
          <Text className="text-3xl font-extrabold text-center text-purple-700 mb-6">
            Submit a Complaint
          </Text>

          <Text className="text-lg font-semibold text-gray-700 mb-2">Your Message</Text>
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Describe your issue here..."
            placeholderTextColor="#a1a1aa"
            value={message}
            onChangeText={setMessage}
            className="border border-purple-300 rounded-lg p-4 text-gray-800 text-base mb-6 shadow-sm bg-purple-50"
            style={{ textAlignVertical: "top" }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            className="bg-purple-600 rounded-lg py-4 shadow-md"
          >
            <Text className="text-white text-center text-xl font-semibold">Send Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Popup */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40 px-8">
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
            }}
            className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg"
          >
            <Text className="text-2xl font-bold text-center mb-4 text-purple-700">
              🎉 Complaint Submitted!
            </Text>
            <Text className="text-center text-gray-600 mb-6">
              Thank you for your feedback. We will address your complaint as soon as possible.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-purple-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold text-lg">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AddComplaint;
