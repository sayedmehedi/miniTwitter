import { Mutex } from "async-mutex";
import { REHYDRATE } from "redux-persist";
import { nanoid } from "@reduxjs/toolkit";
import { loggedOut } from "../slices/auth";
import { RootState } from "../configureStore";
import { cacher } from "@utils/rtkQueryCacheUtils";
import { QUERY_KEYS } from "@src/constants/query-keys";
import { fetchBaseQueryToApplicationError } from "@utils/error-handling";
import { GetUsersByUsernameResponse, PaginationQueryParams } from "@src/models";
import {
  REACT_APP_API_BASE_URL,
} from "react-native-dotenv";
import {
  createApi,
  FetchArgs,
  BaseQueryFn,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApplicationError,
  GetUsersResponse,
  FollowUserRequest,
  FollowUserResponse,
  GetMyTweetsResponse,
  UnfollowUserRequest,
  GetMyTimlineResponse,
  UnfollowUserResponse,
  GetFollowersResponse,
  GetFollowingsResponse,
  MakeTweetLiveResponse,
  MakeTweetLiveRequest,
} from "@src/models";

type Meta = {
  requestId: string;
  timestamp: number;
};

const baseUrl = `${REACT_APP_API_BASE_URL}`;

// create a new mutex
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const authState = (getState() as RootState).auth;
    const token = authState.token;

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("X-Jwt-Token", token);
    }

    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApplicationError,
  {},
  Meta & FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  const requestId = nanoid();
  const timestamp = Date.now();
  let baseResult = await baseQuery(args, api, extraOptions);
  console.log("login error kina check kra", (baseResult.data as { error: string })?.error);

  const isUnauthenticatedError = (baseResult.data as { error: string })?.error && (baseResult.data as { error: string }).error === "Invalid or Expired JWT"

  if (isUnauthenticatedError) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // const refreshResult = await baseQuery("/login", api, extraOptions);
        // if (refreshResult.data) {
        //   api.dispatch(tokenReceived(refreshResult.data as LoginResponse));
        //   // retry the initial query
        //   baseResult = await baseQuery(args, api, extraOptions);
        // } else {
        api.dispatch(loggedOut());
        // }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      baseResult = await baseQuery(args, api, extraOptions);
    }
  }

  const meta = baseResult.meta && { ...baseResult.meta, requestId, timestamp };

  const baseError = baseResult.error;

  if (isUnauthenticatedError) {
    const applicationError = fetchBaseQueryToApplicationError({
      status: 401,
      data: {
        error: "Invalid or Expired JWT",
      }
    });

    return {
      error: applicationError,
      meta,
    };
  }

  if (baseError) {
    const applicationError = fetchBaseQueryToApplicationError(baseError);

    return {
      error: applicationError,
      meta,
    };
  }

  return {
    data: baseResult.data,
    meta,
  };
};

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    ...cacher.defaultTags,
    QUERY_KEYS.TIMELINE,
    QUERY_KEYS.FOLLOWER,
    QUERY_KEYS.FOLLOWING,
    QUERY_KEYS.TWEET,
    QUERY_KEYS.USER,
  ],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query(body) {
        return {
          body,
          method: "POST",
          url: "signup",
        };
      },
      invalidatesTags: cacher.invalidatesUnauthorized(),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query(body) {
        return {
          body,
          method: "POST",
          url: "login",
        };
      },
      invalidatesTags: cacher.invalidatesUnauthorized(),
    }),
    refetchErroredQueries: builder.mutation<unknown, void>({
      queryFn() {
        return { data: {} };
      },
      invalidatesTags: cacher.invalidatesUnknownErrors(),
    }),

    getMyTimeline: builder.query<GetMyTimlineResponse, PaginationQueryParams>({
      query(params) {
        return {
          params,
          url: "timeline"
        }
      },
      providesTags: [{ type: QUERY_KEYS.TIMELINE, id: "LIST" }]
    }),

    getMyTweets: builder.query<GetMyTweetsResponse, PaginationQueryParams>({
      query(params) {
        return {
          params,
          url: "my-tweets"
        }
      },
      providesTags: [{ type: QUERY_KEYS.TWEET, id: "LIST" }]
    }),

    getFollowers: builder.query<GetFollowersResponse, PaginationQueryParams>({
      query(params) {
        return {
          params,
          url: "followers"
        }
      },
      providesTags: [{ type: QUERY_KEYS.FOLLOWER, id: "LIST" }]
    }),

    getFollowings: builder.query<GetFollowingsResponse, PaginationQueryParams>({
      query(params) {
        return {
          params,
          url: "following"
        }
      },
      providesTags: [{ type: QUERY_KEYS.FOLLOWING, id: "LIST" }]
    }),

    getUsers: builder.query<GetUsersResponse, PaginationQueryParams>({
      query(params) {
        return {
          params,
          url: "users"
        }
      },
      providesTags: [{ type: QUERY_KEYS.USER, id: "LIST" }]
    }),

    getUsersByUsername: builder.query<GetUsersByUsernameResponse, PaginationQueryParams<{ token: string }>>({
      query(body) {
        return {
          body,
          url: "search",
          method: "POST",
        }
      },
      providesTags: [{ type: QUERY_KEYS.USER, id: "LIST" }]
    }),

    followUser: builder.mutation<FollowUserResponse, FollowUserRequest>({
      query(body) {
        return {
          body,
          url: "follow",
          method: "POST",
        }
      },
      invalidatesTags: [{ type: QUERY_KEYS.FOLLOWING, id: "LIST" }]
    }),

    unfollowUser: builder.mutation<UnfollowUserResponse, UnfollowUserRequest>({
      query(body) {
        return {
          body,
          url: "unfollow",
          method: "POST",
        }
      },
      invalidatesTags: [{ type: QUERY_KEYS.FOLLOWING, id: "LIST" }]
    }),

    makeTweetLive: builder.mutation<MakeTweetLiveResponse, MakeTweetLiveRequest>({
      query(body) {
        return {
          body,
          url: "tweet",
          method: "POST",
        }
      },
      invalidatesTags: [{ type: QUERY_KEYS.TWEET, id: "LIST" }, { type: QUERY_KEYS.TIMELINE, id: "LIST" }]
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useMakeTweetLiveMutation,
  useRefetchErroredQueriesMutation,

  useLazyGetUsersQuery,
  useLazyGetMyTweetsQuery,
  useLazyGetFollowersQuery,
  useLazyGetMyTimelineQuery,
  useLazyGetFollowingsQuery,
  useLazyGetUsersByUsernameQuery,
} = api;
