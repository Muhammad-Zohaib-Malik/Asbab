import { Image, View } from "react-native";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import { useEffect, useState } from "react";
import { resetAndNavigate } from "@/utils/Helpers";

const Main = () => {
  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => {
    try {
      resetAndNavigate('/role');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  useEffect(() => {
    if (!hasNavigated) {
      const timeout = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [hasNavigated]);

  return (
    <View style={commonStyles.container}>
      <Image
        source={require('../assets/images/logo_t.png')}
        style={splashStyles.img}
      />
    </View>
  );
};

export default Main;
