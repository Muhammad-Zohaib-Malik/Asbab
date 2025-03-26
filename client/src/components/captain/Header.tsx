// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import React from "react";
// import SwitchToggle from "react-native-switch-toggle";
// import Notification from "@/assets/icons/Notification";

// interface HeaderProps {
//   isOn: boolean;
//   toggleSwitch: () => void;
// }

// export default function Header({ isOn, toggleSwitch }: HeaderProps) {
//   return (
//     <View style={styles.headerMain}>
//       <View style={styles.headerMargin}>
//         <View style={styles.headerTop}>
//           <View>
//             <Text style={styles.title}>
//               Asbab
//             </Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.notificationButton}
//             activeOpacity={0.5}
//           >
//             <Notification color="#fff" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.switchContainer}>
//           <View style={styles.switchTextContainer}>
//             <Text style={[styles.valueTitle, { color: isOn ? '#22C55E' : '#000' }]}>
//               {isOn ? "On" : "Off"}
//             </Text>
//             <Text style={styles.statusText}>
//               *You are {isOn ? "available" : "not available"} for ride now!
//             </Text>
//           </View>
//           <View style={styles.switchBorder}>
//             <SwitchToggle
//               switchOn={isOn}
//               onPress={toggleSwitch}
//               containerStyle={styles.switchView}
//               circleStyle={styles.switchCircle}
//               backgroundColorOff="#E5E5E5"
//               backgroundColorOn="#E5E5E5"
//               circleColorOn="#3B82F6"
//               circleColorOff="#000000"
//             />
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   headerMain: {
//     width: '100%',
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 10,
//     paddingTop: 40,
//     height: 115,
//   },
//   headerMargin: {
//     marginHorizontal: 10,
//     marginTop: 10,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 12,
//   },
//   title: {
//     fontSize: 22,
//     color: '#fff',
//     textAlign: 'left',
//   },
//   notificationButton: {
//     height: 15,
//     width: 40,
//     borderWidth: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 4,
//     borderColor: '#93C5FD',
//   },
//   switchContainer: {
//     height: 28,
//     width: '100%',
//     marginVertical: 6,
//     borderRadius: 25,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//   },
//   switchTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   valueTitle: {
//     fontWeight: '500',
//   },
//   statusText: {
//     color: '#000',
//   },
//   switchBorder: {
//     height: 20,
//     width: 45,
//     borderWidth: 2,
//     borderRadius: 25,
//     borderColor: '#E5E5E5',
//   },
//   switchView: {
//     height: 20,
//     width: 55,
//     borderRadius: 25,
//     padding: 8,
//     borderColor: '#93C5FD',
//   },
//   switchCircle: {
//     height: 15,
//     width: 25,
//     borderRadius: 20,
//   },
// });