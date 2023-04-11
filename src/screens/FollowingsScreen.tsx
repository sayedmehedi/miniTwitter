import React from 'react'
import UserCard from '@components/UserCard';
import { FlatList, View } from 'react-native'
import useInfiniteQuery from '@hooks/useInfiniteQuery';
import ListEmptyComponent from '@components/ListEmptyComponent';
import { useLazyGetFollowingsQuery, } from '@store/services/api';
import { ActivityIndicator, Divider, } from 'react-native-paper';
import FullScreenActivityIndicator from '@components/FullScreenActivityIndicator';

const FollowingsScreen = () => {
    const pageRef = React.useRef(1);
    const [fetchFollowings, result] = useLazyGetFollowingsQuery();

    const { data, fetchNextPage, isFetchingNextPage, isLoading, refresh, isRefetching, updateData } = useInfiniteQuery({
        page: 1
    },
        fetchFollowings,
        result,
        {
            getNextPageParam(lastPage) {
                pageRef.current += 1
                if (lastPage && lastPage.followings.length > 0) {
                    return {
                        page: pageRef.current
                    };
                }
            },
        })

    const followingsData = data.flatMap(eachData => eachData.followings)

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
                data={followingsData}
                refreshing={isRefetching}
                onEndReached={() => {
                    fetchNextPage();
                }}
                ItemSeparatorComponent={() => <Divider />}
                ListEmptyComponent={<ListEmptyComponent />}
                renderItem={({ item }) => {
                    return (
                        <UserCard item={item} isFollowing={true} onUnfollowSuccess={() => {
                            updateData((pages) => {
                                return pages.map(eachPage => {
                                    const followings = eachPage.followings.filter(following => following.id !== item.id)

                                    return {
                                        followings,
                                        count: eachPage.count
                                    }
                                })
                            })

                        }} />
                    )
                }}
                ListFooterComponent={isFetchingNextPage ? <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View> : null}
            />
        </View>
    )
}

export default FollowingsScreen