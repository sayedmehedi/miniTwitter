import React from 'react'
import UserCard from '@components/UserCard';
import { FlatList, View, } from 'react-native'
import Toast from 'react-native-toast-message';
import { FF_MEDIUM, useAppTheme } from '@src/theme';
import { ApplicationError, User, } from '@src/models';
import ListEmptyComponent from '@components/ListEmptyComponent';
import { ActivityIndicator, Button, Divider, Text, TextInput } from 'react-native-paper'
import { useFollowUserMutation, useLazyGetUsersByUsernameQuery } from '@store/services/api'

export default function SearchUserScreen() {
    const theme = useAppTheme();
    const [usersData, setUsersData] = React.useState<User[]>([])

    const [token, setToken] = React.useState("")
    const [fetchUser, { isFetching }] = useLazyGetUsersByUsernameQuery();

    const [followUser] = useFollowUserMutation()


    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={usersData}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <Divider />}
                ListHeaderComponent={<View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            dense
                            value={token}
                            mode={"outlined"}
                            onChangeText={setToken}
                            placeholder='Search mini twitter'
                            right={(token.length > 0) && <TextInput.Icon icon="close" onPress={() => {
                                setToken("")
                                setUsersData([])
                            }} />}
                        />
                    </View>

                    <View style={{ marginTop: 5, marginLeft: 10 }}>
                        <Button
                            loading={isFetching}
                            onPress={() => {
                                fetchUser({
                                    token
                                })
                                    .unwrap()
                                    .then(res => {
                                        setUsersData(res.search_results)
                                    })
                                    .catch((error: ApplicationError) => {
                                        Toast.show({
                                            type: "twitter",
                                            text1: error.error
                                        })
                                    })
                            }}
                            mode='contained'
                            buttonColor={theme.colors.secondary}
                            style={{
                                borderRadius: 0
                            }}>Search</Button>
                    </View>
                </View>}
                renderItem={({ item }) => {
                    return (
                        <UserCard item={item} />
                    )
                }}
                ListEmptyComponent={token === "" ? <View style={{
                    padding: 10,
                }}>


                    <Text
                        style={{
                            color: "#657786",
                            textAlign: "center",
                            fontFamily: FF_MEDIUM,
                        }}>
                        Try searching for people
                    </Text>
                </View> : <ListEmptyComponent />}
                ListFooterComponent={isFetching ? <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View> : null}
            />
        </View>
    )
}