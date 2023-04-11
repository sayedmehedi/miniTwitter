import React from 'react'
import UserCard from '@components/UserCard';
import { View, FlatList } from 'react-native'
import useInfiniteQuery from '@hooks/useInfiniteQuery';
import { useLazyGetUsersQuery } from '@store/services/api';
import { ActivityIndicator, Divider, Text, } from 'react-native-paper';
import FullScreenActivityIndicator from '@components/FullScreenActivityIndicator';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import ListEmptyComponent from '@components/ListEmptyComponent';

export default function UsersScreen() {
    const pageRef = React.useRef(1);
    const [fetchUser, result] = useLazyGetUsersQuery();

    const { data, fetchNextPage, isFetchingNextPage, isLoading, refresh, isRefetching } = useInfiniteQuery(
        { page: 1 },
        fetchUser,
        result,
        {
            getNextPageParam(lastPage) {
                pageRef.current += 1
                if (lastPage && lastPage.users.length > 0) {
                    return {
                        page: pageRef.current
                    };
                }
            },
        })

    const usersData = data.flatMap(eachData => eachData.users)


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
                data={usersData}
                refreshing={isRefetching}
                onEndReached={() => {
                    fetchNextPage();
                }}
                ItemSeparatorComponent={() => <Divider />}
                ListEmptyComponent={<ListEmptyComponent />}
                renderItem={({ item }) => {
                    return (
                        <UserCard item={item} />
                    )
                }}
                ListFooterComponent={isFetchingNextPage ? <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View> : null}
            />
        </View>
    )
}