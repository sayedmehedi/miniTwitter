import React from 'react'
import { View, } from 'react-native'
import { ApplicationError } from '@src/models';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '@src/navigation';
import { FF_SEMI_BOLD, useAppTheme } from '@src/theme';
import { useLoginMutation } from '@store/services/api';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackRoutes } from '@src/constants/navigation';
import { Button, Card, Text, TextInput } from 'react-native-paper'

type LoginScreenProps = StackScreenProps<RootStackParamList, typeof RootStackRoutes.LOGIN>

export default function LoginScreen({ navigation }: LoginScreenProps) {
    const theme = useAppTheme();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [login, { isLoading }] = useLoginMutation()

    const handleLogin = () => {
        login({
            email,
            password
        }).unwrap()
            .catch(error => {
                const err = error as ApplicationError
                Toast.show({
                    type: "twitter",
                    text1: err.error,
                })
            })
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
        }}>
            <Card mode='contained' style={{
                backgroundColor: "transparent"
            }}>
                <Card.Title style={{
                    marginBottom: 20
                }} title={<Text variant='titleLarge' style={{ fontFamily: FF_SEMI_BOLD }}>Sign in to MiniTwitter</Text>} />

                <Card.Content>
                    <View style={{
                        marginBottom: 10
                    }}>
                        <TextInput
                            value={email}
                            mode='outlined'
                            label={"Email"}
                            onChangeText={setEmail}
                            keyboardType={'email-address'}
                        />
                    </View>

                    <TextInput
                        secureTextEntry
                        mode='outlined'
                        value={password}
                        label={"Password"}
                        onChangeText={setPassword}
                    />


                </Card.Content>

                <Card.Actions style={{ marginTop: 24 }}>
                    <Button labelStyle={{ fontFamily: FF_SEMI_BOLD }} style={{ width: "100%" }} mode='contained' buttonColor={theme.colors.secondary} textColor='white' loading={isLoading} onPress={handleLogin}>Login</Button>
                </Card.Actions>
            </Card>

            <View style={{
                marginTop: 30
            }}>
                <Button compact onPress={() => {
                    navigation.navigate(RootStackRoutes.REGISTER)
                }}>Don't have an account?</Button>
            </View>
        </View>
    )
}