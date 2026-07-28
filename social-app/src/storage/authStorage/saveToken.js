import * as SecureStore from 'expo-secure-store';

export const saveToken = async(key,value)=>{
    await SecureStore.setItemAsync(key,value);
    console.log("key :",key , "value :",value);
    
}