import { FC, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RatingPopupProps {
  onSubmit: (rating: number, review: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RatingPopup: FC<RatingPopupProps> = ({ onSubmit, onCancel, loading }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleStarPress = (index: number) => {
    setRating(index + 1);
  };

  return (
    <Modal visible={true} animationType="fade" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[320px] p-6 bg-white rounded-xl shadow-lg">
          <Text className="text-lg font-JakartaLight text-gray-800 mb-4">
            Rate Your Ride
          </Text>

          <View className="flex-row mb-4">
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
              >
                <MaterialCommunityIcons
                  name={index < rating ? "star" : "star-outline"}
                  size={30}
                  color="#f59e0b"
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Write your review..."
            value={review}
            onChangeText={setReview}
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl bg-gray-100 font-JakartaExtraLight"
            multiline
            numberOfLines={3}
          />

          <View className="flex-row justify-between w-full">
            <TouchableOpacity
              className="w-[45%] py-3 bg-gray-200 rounded-lg items-center justify-center"
              onPress={onCancel}
              disabled={loading}
            >
              <Text className="font-JakartaMedium text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-[45%] py-3 rounded-lg items-center justify-center ${
                loading || rating === 0 ? "bg-blue-300" : "bg-blue-600"
              }`}
              onPress={() => onSubmit(rating, review)}
              disabled={loading || rating === 0}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-JakartaMedium text-white">Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingPopup;
