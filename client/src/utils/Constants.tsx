import { Dimensions, DimensionValue, PixelRatio } from "react-native";

export const screenHeight = Dimensions.get('window').height
export const screenWidth = Dimensions.get('window').width

export const windowHeight = (height: DimensionValue): number => {
  if (!height) {
    return 0;
  }
  let tempHeight = screenHeight * (parseFloat(height.toString()) / 667);
  return PixelRatio.roundToNearestPixel(tempHeight);
};

export const windowWidth = (width: DimensionValue): number => {
  if (!width) {
    return 0;
  }
  let tempWidth = screenWidth * (parseFloat(width.toString()) / 480);
  return PixelRatio.roundToNearestPixel(tempWidth);
};

export enum Colors {
    primary = '#FFCA1F',    
    background = '#fff',
    text = '#222',
    theme = '#CF551F',
    secondary = '#E5EBF5',
    tertiary = '#3C75BE',
    secondary_light='#F6F7F9',
    iosColor='#007AFF',
    header='#075BB5',
}

