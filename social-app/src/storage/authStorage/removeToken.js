import * as SecureStore from "expo-secure-store";

export const removeToken = async(key)=>{
    await SecureStore.deleteItemAsync(key)
}