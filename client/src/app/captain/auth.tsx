import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Button,
  ActivityIndicatorBase,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PhoneInput from "@/components/shared/PhoneInput";
import { signIn } from "@/service/authService";
import { useWS } from "@/service/WebProvider";

const Auth = () => {
  const { updateAccessToken } = useWS();

  const [phone, setPhone] = useState("");
  const handleNext = async () => {
    if (!phone && phone.length !== 10) {
      Alert.alert("Enter Your Phone Number");
      return;
    }

    signIn({ role: "captain", phone }, updateAccessToken);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/Logo.png")}
            style={authStyles.logo}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons
              className="font-JakartaMedium "
              name="help"
              size={18}
              color="grey"
            />
            <Text className="font-JakartaMedium text-[#075BB5]">Help</Text>
          </TouchableOpacity>
        </View>

        <Text className="font-JakartaMedium text-[#075BB5]">
          Best of Luck, Captain!
        </Text>

        <PhoneInput onChangeText={setPhone} value={phone} />

        <View style={authStyles.footerContainer}>
          <Text className="font-JakartaMedium" style={authStyles.footerText}>
            By signing up, you agree to our{" "}
            <Text style={authStyles.link}>Terms and Conditions</Text> and{" "}
            <Text style={authStyles.link}>Privacy Policy of Asbab.</Text>
          </Text>

          <TouchableOpacity
            className="bg-[##075BB5] w-64 h-16 items-center justify-center flex mt-4 rounded-xl"
            onPress={handleNext}
            disabled={false}
            activeOpacity={0.8}
          >
            <Text className="text-base text-white font-JakartaMedium">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
