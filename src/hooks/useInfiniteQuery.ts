import React from 'react'
import type { BaseQueryFn, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import type { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';

function useInfiniteQuery<QueryArg, BaseQuery extends BaseQueryFn,
    TagTypes extends string, ResultType,
    ReducerPath extends string = string>(
        initialArgs: Parameters<typeof fetchData>[0],
        fetchData: LazyQueryTrigger<QueryDefinition<QueryArg, BaseQuery, TagTypes, ResultType, ReducerPath>>,
        result: {
            isLoading?: boolean;
            isFetching?: boolean;
            data?: ResultType | undefined;
        },
        options: {
            skip?: boolean;
            getNextPageParam: (lastPage: ResultType | undefined) => undefined | Partial<Parameters<typeof fetchData>[0]>
        }
    ) {
    const [data, setData] = React.useState<ResultType[]>([])

    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefetching, setIsRefetching] = React.useState(false)
    const { data: lastPage, isFetching } = result
    const subscriptionRef = React.useRef<ReturnType<typeof fetchData>>()

    const isFetchingNextPage = !isLoading && isFetching && !isRefetching
    const shouldSkip = options.skip ?? false

    const fetchNextPage = React.useCallback(() => {
        if (isLoading || isRefetching || isFetchingNextPage || shouldSkip) {
            return;
        }

        const nextPageParam = options.getNextPageParam?.(lastPage)

        if (nextPageParam === undefined) {
            return;
        }

        subscriptionRef.current = fetchData({ ...initialArgs, ...nextPageParam })

        subscriptionRef.current
            .unwrap()
            .then(res => {
                setData(prevData => prevData.concat(res))
            })
    }, [
        isLoading,
        fetchData,
        isRefetching,
        isFetchingNextPage,
        options.getNextPageParam,
    ])

    const handleGetInitialUsers = (args: Parameters<typeof fetchData>[0]) => {
        const subscription = fetchData(args)

        subscription
            .unwrap()
            .then(res => {
                setData(!Array.isArray(res) ? [res] : res)
            })
            .finally(() => {
                setIsLoading(false)
            })

        return subscription
    }

    const handleRefetch = React.useCallback(() => {
        setIsRefetching(true)
        subscriptionRef.current = handleGetInitialUsers(initialArgs)
        subscriptionRef.current
            .unwrap()
            .finally(() => {
                setIsRefetching(false)
            })
    }, [JSON.stringify(initialArgs)])


    React.useEffect(() => {
        if (shouldSkip) {
            return () => {

            }
        }

        const subscription = handleGetInitialUsers(initialArgs);

        return () => {
            subscription.abort()
        }
    }, [shouldSkip, JSON.stringify(initialArgs)])

    React.useEffect(() => {
        return () => {
            subscriptionRef.current?.abort();
        }
    }, [])

    const updateData = React.useCallback((callback: (data: ResultType[]) => ResultType[]) => {
        setData(prevData => callback(prevData))
    }, [])

    return {
        data,
        isLoading,
        updateData,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage,
        refresh: handleRefetch,
    }
}

export default useInfiniteQuery
