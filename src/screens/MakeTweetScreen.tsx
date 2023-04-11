import React from 'react'
import { View, } from 'react-native'
import { FF_SEMI_BOLD } from '@src/theme'
import Toast from 'react-native-toast-message'
import { ApplicationError } from '@src/models'
import { RootStackParamList } from '@src/navigation'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackRoutes } from '@src/constants/navigation'
import { useMakeTweetLiveMutation } from '@store/services/api'
import { Appbar, Button, TextInput } from 'react-native-paper'

type Props = StackScreenProps<RootStackParamList>

const MakeTweetScreen = ({ navigation, }: Props) => {
    const [content, setContent] = React.useState("")

    const [makeTweet, { isLoading }] = useMakeTweetLiveMutation()

    const handleMakeTweet = () => {
        makeTweet({
            content
        }).unwrap()
            .then(() => {
                navigation.navigate(RootStackRoutes.MY_TWEETS);
                Toast.show({
                    type: "twitter",
                    text1: "Your tweet was sent"
                })
            })
            .catch((error: ApplicationError) => {
                Toast.show({
                    type: "twitter",
                    text1: error.error
                })
            })
    }

    return (
        <View style={{ flex: 1, paddingRight: 20 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title={""} />
                <Button
                    loading={isLoading}
                    mode='contained'
                    disabled={content === ""}
                    onPress={handleMakeTweet}
                    labelStyle={{ fontFamily: FF_SEMI_BOLD }}>Tweet</Button>
            </Appbar.Header>


            <TextInput
                mode='flat'
                multiline
                value={content}
                onChangeText={setContent}
                placeholder={"What's happening?"}
                style={{
                    width: "100%",
                    maxHeight: 250,
                    minHeight: 200,
                }}
            />
        </View>
    )
}

export default MakeTweetScreen