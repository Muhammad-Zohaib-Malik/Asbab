import React, { useState } from "react";
import {
  View,
  Button,
  Alert,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { useLocalSearchParams, router } from "expo-router";
import RatingPopup from "../../components/customer/RatingPopup";
import { ratingRide } from "../../service/rideService";

const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { rideId, fare } = useLocalSearchParams();

  const [amount, setAmount] = useState(fare || "");
  const [currency, setCurrency] = useState("pkr");
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const amountInCents = () => {
    const num = parseFloat(Array.isArray(amount) ? (amount[0] ?? "") : amount);
    if (isNaN(num) || num <= 0) return 0;
    return Math.round(num * 100);
  };

  const fetchPaymentSheetParams = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.170.209:3000/create-payment-sheet",
        {
          amount: amountInCents(),
          currency: currency.toLowerCase(),
        },
      );

      const { paymentIntent, ephemeralKey, customer } = response.data;
      return { paymentIntent, ephemeralKey, customer };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", error.response?.data?.message || error.message);
      } else {
        Alert.alert("Error", "Something went wrong");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const initializePaymentSheet = async () => {
    if (amountInCents() <= 0) {
      Alert.alert(
        "Invalid amount",
        "Please enter a valid amount greater than zero",
      );
      return;
    }

    const params = await fetchPaymentSheetParams();
    if (!params) return;

    const { paymentIntent, ephemeralKey, customer } = params;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "My App, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
    });

    if (!error) {
      setPaymentSheetReady(true);
      Alert.alert("Ready", "Payment sheet is ready.");
    } else {
      Alert.alert("Init Error", error.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setPaymentSheetReady(false);
      setAmount("");

      Alert.alert("Success", "Payment confirmed!", [
        {
          text: "OK",
          onPress: () => {
            setShowRating(true);
          },
        },
      ]);
    }
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    setRatingLoading(true);
    const success = await ratingRide(rideId as string, rating, review);
    setRatingLoading(false);
    setShowRating(false);

    if (success) {
      router.navigate("/customer/home");
    } else {
      Alert.alert("Error", "Failed to submit rating.");
    }
  };

  const handleRatingCancel = () => {
    setShowRating(false);
    router.navigate("/customer/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Amount ({currency.toUpperCase()}):</Text>
      <TextInput
        className="font-JakartaMedium"
        keyboardType="numeric"
        value={Array.isArray(amount) ? (amount[0] ?? "") : amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <Text style={styles.label}>Currency (e.g. pkr):</Text>
      <TextInput
        className="font-JakartaMedium"
        autoCapitalize="none"
        placeholder="Currency"
        value={currency}
        onChangeText={(text) => setCurrency(text.trim())}
        style={styles.input}
      />

      <View style={{ marginVertical: 10 }} className="font-JakartaBold">
        <Button
          title={loading ? "Loading..." : "Initialize Payment"}
          onPress={initializePaymentSheet}
          disabled={loading}
        />
      </View>

      <View style={{ marginVertical: 10 }} className="font-JakartaBold">
        <Button
          title="Pay"
          onPress={openPaymentSheet}
          disabled={!paymentSheetReady || loading}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* ⭐ Show Rating Popup */}
      {showRating && (
        <RatingPopup
          onSubmit={handleRatingSubmit}
          onCancel={handleRatingCancel}
          loading={ratingLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});

export default Payment;
