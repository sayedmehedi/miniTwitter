import React from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message';
import { ApplicationError } from '@src/models';
import { RootStackParamList } from '@src/navigation';
import { FF_SEMI_BOLD, useAppTheme } from '@src/theme';
import { useRegisterMutation } from '@store/services/api';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackRoutes } from '@src/constants/navigation';
import { Button, Card, Text, TextInput } from 'react-native-paper'

type RegisterScreenProps = StackScreenProps<RootStackParamList, typeof RootStackRoutes.REGISTER>


export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const theme = useAppTheme();
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");


    const [register, { isLoading }] = useRegisterMutation()

    const handleRegister = () => {
        register({
            email,
            password,
            username,
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
                }} title={<Text variant='titleLarge' style={{ fontFamily: FF_SEMI_BOLD }}>Join MiniTwitter Today</Text>} />

                <Card.Content>
                    <View style={{
                        marginBottom: 10
                    }}>
                        <TextInput
                            mode={"outlined"}
                            value={username}
                            label={"Username"}
                            onChangeText={setUsername}
                        />
                    </View>

                    <View style={{
                        marginBottom: 10
                    }}>
                        <TextInput
                            mode={"outlined"}
                            value={email}
                            label={"Email"}
                            onChangeText={setEmail}
                            keyboardType={'email-address'}
                        />
                    </View>

                    <TextInput
                        mode={"outlined"}
                        secureTextEntry
                        value={password}
                        label={"Password"}
                        onChangeText={setPassword}
                    />


                </Card.Content>

                <Card.Actions style={{ marginTop: 24 }}>
                    <Button labelStyle={{ fontFamily: FF_SEMI_BOLD }} style={{ width: "100%" }} mode='contained' buttonColor={theme.colors.secondary} textColor='white' loading={isLoading} onPress={handleRegister}>Create Account</Button>
                </Card.Actions>
            </Card>

            <View style={{
                marginTop: 30
            }}>
                <Button compact onPress={() => {
                    navigation.navigate(RootStackRoutes.LOGIN)
                }}>Already have an account?</Button>
            </View>
        </View>
    )
}