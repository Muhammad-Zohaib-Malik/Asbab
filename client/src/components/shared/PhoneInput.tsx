import { View, Text, TextInput } from "react-native";
import React, { FC } from "react";

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
}) => {
  return (
    <View className="flex-row items-center gap-4 border border-[#222]  rounded-md p-2 mt-10">
      <Text className="font-medium">+92</Text>
      <TextInput
        placeholder="000000000"
        keyboardType="phone-pad"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={"#ccc"}
        maxLength={10}
      />
    </View>
  );
};

export default PhoneInput;
