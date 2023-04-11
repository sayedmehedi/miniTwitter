import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

function FullScreenActivityIndicator() {
    return (
        <View style={styles.container}>
            <View>
                <ActivityIndicator size={"large"} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default FullScreenActivityIndicator