import React from 'react'
import { View, } from 'react-native'
import { Text } from 'react-native-paper'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const ListEmptyComponent = () => {
    return (
        <View style={{
            padding: 10,
            marginTop: 30,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View style={{ marginBottom: 20 }}>
                <MaterialCommunityIcons name={"weather-windy"} size={30} />
            </View>

            <Text
                style={{
                    textAlign: "center"
                }}>
                No Data
            </Text>
        </View>
    )
}

export default ListEmptyComponent