import React from 'react'
import dayjs from 'dayjs';
import { View, FlatList } from 'react-native'
import { FF_MEDIUM, FF_SEMI_BOLD } from '@src/theme';
import useInfiniteQuery from '@hooks/useInfiniteQuery';
import { useLazyGetMyTweetsQuery } from '@store/services/api';
import ListEmptyComponent from '@components/ListEmptyComponent';
import { ActivityIndicator, Card, Divider, Text } from 'react-native-paper';
import FullScreenActivityIndicator from '@components/FullScreenActivityIndicator';

const MyTweetsScreen = () => {
    const pageRef = React.useRef(1);
    const [fetchTweet, result] = useLazyGetMyTweetsQuery();
    const { data, fetchNextPage, isFetchingNextPage, isLoading, refresh, isRefetching } = useInfiniteQuery({
        page: 1
    },
        fetchTweet,
        result,
        {
            getNextPageParam(lastPage) {
                pageRef.current += 1
                if (lastPage && lastPage.my_tweets.length > 0) {
                    return {
                        page: pageRef.current
                    };
                }
            },
        })

    const myTweetsData = data.flatMap(eachData => eachData.my_tweets)

    if (isLoading) {
        return <FullScreenActivityIndicator />
    }


    return (
        <View style={{ flex: 1, }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                onRefresh={() => {
                    pageRef.current = 1
                    refresh()
                }}
                data={myTweetsData}
                refreshing={isRefetching}
                onEndReached={() => {
                    fetchNextPage();
                }}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => {
                    return (
                        <Card mode='contained'>
                            <Card.Title
                                title={<View style={{ flexDirection: "row", alignItems: "flex-end", }}>
                                    <View style={{ marginRight: 5 }}>
                                        <Text variant='titleSmall' style={{ fontFamily: FF_SEMI_BOLD }}>{item.user.username}</Text>
                                    </View>

                                    <View>
                                        <Text variant='bodySmall' style={{ color: "#657786" }}>{dayjs(item.published).fromNow()}</Text>
                                    </View>
                                </View>}

                            />
                            <Card.Content>
                                <Text variant="bodySmall" style={{ fontFamily: FF_MEDIUM }}>{item.content}</Text>
                            </Card.Content>
                        </Card>
                    )
                }}
                ListEmptyComponent={<ListEmptyComponent />}
                ListFooterComponent={isFetchingNextPage ? <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View> : null}
            />
        </View>
    )
}

export default MyTweetsScreen