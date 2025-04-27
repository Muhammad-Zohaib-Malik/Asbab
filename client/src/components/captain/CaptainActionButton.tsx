import { orderStyles } from "@/styles/captainStyles";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "rn-swipe-button";

const CaptainActionButton: FC<{
  ride: any;
  color?: string;
  title: string;
  onPress: () => void;
}> = ({ ride, color = Colors.iosColor, title, onPress }) => {
  const CheckoutButton = () => {
    return (
      <Ionicons
        name="arrow-forward-sharp"
        style={{ bottom: 2 }}
        size={32}
        color="#fff"
      />
    );
  };

  return (
    <View style={rideStyles?.swipeableContaninerRider}>
      <View style={commonStyles?.flexRowBetween}>
        <Text numberOfLines={1}>Meet the Customer</Text>
        <Text>
          +92{" "}
          {ride?.customer?.phone &&
            ride?.customer?.phone?.slice(0, 5) +
              " " +
              ride?.customer?.phone?.slice(5)}
        </Text>
      </View>

      <View style={orderStyles?.locationsContainer}>
        <View style={orderStyles?.flexRowBase}>
          <View>
            <View style={orderStyles?.pickupHollowCircle} />
            <View style={orderStyles?.continuousLine} />
          </View>
          <View style={orderStyles?.infoText}>
            <Text numberOfLines={1}>{ride?.pickup?.address?.slice(0, 10)}</Text>
            <Text numberOfLines={2} style={orderStyles.label}>
              {ride?.pickup?.address}
            </Text>
          </View>
        </View>

        <View style={orderStyles?.locationsContainer}>
          <View style={orderStyles?.flexRowBase}>
            <View>
              <View style={orderStyles?.dropHollowCircle} />
              <View style={orderStyles?.continuousLine} />
            </View>
            <View style={orderStyles?.infoText}>
              <Text numberOfLines={1}>{ride?.drop?.address?.slice(0, 10)}</Text>
              <Text numberOfLines={2} style={orderStyles.label}>
                {ride?.drop?.address}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <SwipeButton
        containerStyles={rideStyles?.swipeButtonContainer}
        height={30}
        shouldResetAfterSuccess={true}
        resetAfterSuccessAnimDelay={200}
        onSwipeSuccess={onPress}
        railBackgroundColor={color}
        railStyles={rideStyles?.railStyles}
        railBorderColor="transparent"
        railFillBackgroundColor="rgba(255, 255, 255, 0.6)"
        railFillBorderColor="rgba(255, 255, 255, 0.6)"
        titleColor="#fff"
        titleFontSize={RFValue(13)}
        titleStyles={rideStyles?.titleStyles}
        thumbIconComponent={CheckoutButton}
        thumbIconStyles={rideStyles?.thumbIconStyles}
        title={title.toUpperCase()}
        thumbIconBackgroundColor="transparent"
        thumbIconBorderColor="transparent"
        thumbIconHeight={50}
        thumbIconWidth={60}
      />
    </View>
  );
};

export default CaptainActionButton;
