import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

interface PaymentMethodPopupProps {
  onSelect: (method: "cash" | "card") => void;
  onCancel: () => void;
}

const PaymentMethodPopup: FC<PaymentMethodPopupProps> = ({
  onSelect,
  onCancel,
}) => {
  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text className="font-JakartaMedium" style={styles.title}>
            Select Payment Method
          </Text>

          <TouchableOpacity
            className="font-JakartaMedium"
            style={styles.button}
            onPress={() => onSelect("cash")}
          >
            <Text style={styles.buttonText} className="font-JakartaMedium">Cash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="font-JakartaMedium"
            style={styles.button}
            onPress={() => onSelect("card")}
          >
            <Text className="font-JakartaMedium" style={styles.buttonText}>
              Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={{ color: "red" }} className="font-JakartaMedium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default PaymentMethodPopup;
