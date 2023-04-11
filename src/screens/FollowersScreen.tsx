import React from 'react'
import UserCard from '@components/UserCard';
import { View, FlatList } from 'react-native'
import useInfiniteQuery from '@hooks/useInfiniteQuery';
import { useLazyGetFollowersQuery } from '@store/services/api';
import ListEmptyComponent from '@components/ListEmptyComponent';
import { ActivityIndicator, Divider, Text } from 'react-native-paper';
import FullScreenActivityIndicator from '@components/FullScreenActivityIndicator';

const FollowersScreen = () => {
    const pageRef = React.useRef(1);
    const [fetchFollowers, result] = useLazyGetFollowersQuery();

    const { data, fetchNextPage, isFetchingNextPage, isLoading, refresh, isRefetching } = useInfiniteQuery({
        page: 1
    },
        fetchFollowers,
        result,
        {
            getNextPageParam(lastPage) {
                pageRef.current += 1
                if (lastPage && lastPage.followers.length > 0) {
                    return {
                        page: pageRef.current
                    };
                }
            },
        })

    const followersData = data.flatMap(eachData => eachData.followers)

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
                data={followersData}
                refreshing={isRefetching}
                onEndReached={() => {
                    fetchNextPage();
                }}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => {
                    return (
                        <UserCard item={item} />
                    )
                }}
                ListEmptyComponent={<ListEmptyComponent />}
                ListFooterComponent={isFetchingNextPage ? <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View> : null}
            />
        </View>
    )
}

export default FollowersScreen