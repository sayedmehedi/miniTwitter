import React from 'react'
import { User } from '@src/models'
import { View, } from 'react-native'
import Toast from 'react-native-toast-message';
import { ApplicationError } from '@src/models';
import { Button, Card, Text } from 'react-native-paper'
import { FF_SEMI_BOLD, useAppTheme } from '@src/theme'
import { useFollowUserMutation, useUnfollowUserMutation } from '@store/services/api';


type Props = {
    item: User;
    isFollowing?: boolean;
    onFollowSuccess?: (item: User) => void;
    onUnfollowSuccess?: (item: User) => void;
}

const UserCard = ({ item, isFollowing: isFollowingProp = false, onFollowSuccess, onUnfollowSuccess }: Props) => {
    const theme = useAppTheme();
    const [followed, setFollowed] = React.useState(isFollowingProp);
    const [followUser, { isLoading: isFollowing }] = useFollowUserMutation()
    const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation()

    return (
        <Card mode='contained'>
            <Card.Title
                title={
                    <View>
                        <Text variant='titleSmall' style={{ fontFamily: FF_SEMI_BOLD }}>{item.username}</Text>
                    </View>
                }
                subtitle={
                    <View>
                        <Text variant='bodySmall' style={{ color: "#657786" }}>{item.email}</Text>
                    </View>
                }

                right={() => {
                    return followed ? <Button
                        compact
                        mode='contained'
                        loading={isUnfollowing}
                        disabled={isUnfollowing}
                        style={{ marginRight: 10 }}
                        labelStyle={{ fontSize: 13 }}
                        textColor={theme.colors.white}
                        buttonColor={theme.colors.secondary}
                        onPress={() => {
                            unfollowUser({
                                user_id: item.id
                            }).unwrap()
                                .then(() => {
                                    setFollowed(false)
                                    Toast.show({
                                        type: "twitter",
                                        text1: `Unfollowed ${item.username}`
                                    })
                                    onUnfollowSuccess?.(item)
                                }).catch((error: ApplicationError) => {
                                    Toast.show({
                                        type: "twitter",
                                        text1: error.error
                                    })
                                })
                        }}
                    >
                        Unfollow
                    </Button>
                        :
                        <Button
                            compact
                            mode='contained'
                            loading={isFollowing}
                            disabled={isFollowing}
                            style={{ marginRight: 10 }}
                            labelStyle={{ fontSize: 13 }}
                            textColor={theme.colors.white}
                            buttonColor={theme.colors.secondary}
                            onPress={() => {
                                followUser({
                                    user_id: item.id
                                }).unwrap()
                                    .then(() => {
                                        setFollowed(true)
                                        Toast.show({
                                            type: "twitter",
                                            text1: `Following ${item.username}`
                                        })
                                        onFollowSuccess?.(item)
                                    }).catch((error: ApplicationError) => {
                                        Toast.show({
                                            type: "twitter",
                                            text1: error.error
                                        })
                                    })
                            }}
                        >
                            Follow
                        </Button>
                }}
            />
        </Card>
    )
}

export default UserCard