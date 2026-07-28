import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { COLORS } from '../constants/colors'

const OnlineDot = () => {
  return (
     <View
          style={{
            height: moderateScale(20),
            width: moderateScale(20),
            borderRadius: moderateScale(15),
            backgroundColor: COLORS.black,
            position: "absolute",
            left: 65,
            top: 80,
            zIndex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: "75%",
              width: "75%",
              borderRadius: moderateScale(50),
              backgroundColor: COLORS.online,
            }}
          ></View>
        </View>
  )
}

// export default OnlineDot

const styles = StyleSheet.create({})