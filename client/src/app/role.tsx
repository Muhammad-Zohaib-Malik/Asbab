import { roleStyles } from "@/styles/roleStyles";
import { router } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate("/customer/auth");
  };
  const handleCaptainPress = () => {
    router.navigate("/captain/auth");
  };

  return (
    <View style={roleStyles.container}>
      <Image
        source={require("@/assets/images/Logo.png")}
        style={roleStyles.logo}
      />
      <Text className="font-JakartaMedium text-[20px] text-[#075BB5]">
        Select Who you are
      </Text>

      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/customer.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <Text className="font-JakartaMedium text-[15px] text-[#075BB5]">
            Customer
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={roleStyles.card} onPress={handleCaptainPress}>
        <Image
          source={require("@/assets/images/captain.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <Text className="font-JakartaMedium text-[15px] text-[#075BB5]">
            Captain
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default Role;
