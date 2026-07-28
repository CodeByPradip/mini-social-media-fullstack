import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { COLORS, RADIUS } from '../constants/colors'

const Loder = () => {
  return (
   <View style={{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        backgroundColor:"#0000008d",
        zIndex:999
      }}>
       <View style={{
        height:moderateScale(75),
        width:moderateScale(80),
        backgroundColor:COLORS.white,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:moderateScale(RADIUS.md)
       }}>
         <ActivityIndicator size={"large"} color={COLORS.primary} />
       </View>
      </View>
  )
}

export default Loder