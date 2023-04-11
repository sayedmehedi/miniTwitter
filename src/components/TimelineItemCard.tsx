import dayjs from 'dayjs'
import React from 'react'
import { View, } from 'react-native'
import { Timeline } from '@src/models'
import { Button, Card, Text } from 'react-native-paper'
import { FF_MEDIUM, FF_SEMI_BOLD, useAppTheme } from '@src/theme'

type Props = {
    item: Timeline
}

const TimelineItemCard = ({ item }: Props) => {
    const theme = useAppTheme();

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
                right={() => <Button textColor={theme.colors.secondary}>Unfollow</Button>}
            />
            <Card.Content>
                <Text variant="bodySmall" style={{ fontFamily: FF_MEDIUM }}>{item.content}</Text>
            </Card.Content>
        </Card>
    )
}

export default TimelineItemCard