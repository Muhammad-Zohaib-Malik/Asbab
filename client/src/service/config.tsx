import { Platform } from "react-native"

export const BASE_URL = 'http://192.168.0.106:3000'

export const SOCKET_URL = Platform.OS === "ios" ?
  'ws://192.168.0.106:3000' :
  'http://192.168.0.106:3000'