import { FC, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import Expo Vector Icons

interface RatingPopupProps {
  onSubmit: (rating: number, review: string) => void;
  onCancel: () => void;
}

const RatingPopup: FC<RatingPopupProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // Function to handle clicking on a star and setting the rating
  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[320px] p-6 bg-white rounded-xl shadow-lg">
          <Text className="text-lg font-JakartaLight text-gray-800 mb-4">
            Rate Your Ride
          </Text>

          {/* Rating stars */}
          <View className="flex-row mb-4">
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                <MaterialCommunityIcons
                  name={index < rating ? "star" : "star-outline"}
                  size={24}
                  color="#f59e0b" // Gold color for selected stars
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review input */}
          <TextInput
            placeholder="Write your review..."
            value={review}
            onChangeText={setReview}
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl bg-gray-100"
            multiline
          />

          <View className="flex-row justify-between w-full">
            <TouchableOpacity
              className="w-[45%] py-3 bg-gray-200 rounded-lg items-center justify-center"
              onPress={onCancel}
            >
              <Text className="font-semibold text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[45%] py-3 bg-blue-500 rounded-lg items-center justify-center"
              onPress={() => onSubmit(rating, review)}
            >
              <Text className="font-semibold text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingPopup;
