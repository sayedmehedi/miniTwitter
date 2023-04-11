import React from 'react'
import dayjs from 'dayjs';
import { CombinedDefaultTheme, } from '@src/theme';
import relativeTime from "dayjs/plugin/relativeTime"
import useInfiniteQuery from '@hooks/useInfiniteQuery';
import { View, FlatList, StyleSheet } from 'react-native'
import { MainTabRoutes } from '@src/constants/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackRoutes } from '@src/constants/navigation';
import TimelineItemCard from '@components/TimelineItemCard';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useLazyGetMyTimelineQuery } from '@store/services/api'
import ListEmptyComponent from '@components/ListEmptyComponent';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Divider, FAB, } from 'react-native-paper';
import FullScreenActivityIndicator from '@components/FullScreenActivityIndicator';
import { MainDrawerParamList, MainTabParamList, RootStackParamList } from '@src/navigation';

dayjs.extend(relativeTime)

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, typeof MainTabRoutes.MY_TIMELINE>,
    CompositeScreenProps<
        DrawerScreenProps<MainDrawerParamList>,
        StackScreenProps<RootStackParamList>
    >>;

export default function MyTimelineScreen({ navigation }: Props) {
    const pageRef = React.useRef(1);
    const [fetchTimeline, result] = useLazyGetMyTimelineQuery();

    const { data, fetchNextPage, isFetchingNextPage, isLoading, refresh, isRefetching } = useInfiniteQuery({
        page: 1
    }, fetchTimeline, result,
        {
            getNextPageParam(lastPage) {
                pageRef.current += 1
                if (lastPage && lastPage.timeline.length > 0) {
                    return {
                        page: pageRef.current
                    };
                }
            },
        })


    const timelineData = data.flatMap(eachData => eachData.timeline)

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
                data={timelineData}
                refreshing={isRefetching}
                onEndReached={() => {
                    fetchNextPage();
                }}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => {
                    return (
                        <TimelineItemCard item={item} />
                    )
                }}
                ListEmptyComponent={<ListEmptyComponent />}
                ListFooterComponent={isFetchingNextPage ? <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View> : null}
            />

            <FAB
                icon="plus"
                color='white'
                style={styles.fab}
                onPress={() => {
                    navigation.navigate(RootStackRoutes.MAKE_TWEET)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    fab: {
        right: 0,
        bottom: 0,
        margin: 16,
        borderRadius: 9999,
        position: 'absolute',
        backgroundColor: CombinedDefaultTheme.colors.primary,
    },
})