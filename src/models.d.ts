import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export type ValidationError = {
  error: string;
};



export type RegisterResponse = {
  message: string
};

export type RegisterRequest = {
  username: string
  email: string
  password: string
};


export type LoginResponse = {
  token: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type PaginatedResponse<Key extends string = "count", D extends { id: number } = {}> = {
  [key in Key]: Array<D>;
} & {
  count: number;
};

export type PaginationQueryParams<E extends {} = {}> = Partial<{
  page: number;
  per_page: number;
}> &
  E;

export type ApplicationError =
  | {
    status: "CUSTOM_ERROR";
    data: {
      data: FetchBaseQueryError["data"];
      status: FetchBaseQueryError["status"];

      isNotFoundError: boolean;
      isValidationError: false;
      isUnauthorizedError: boolean;
      isUnauthenticatedError: boolean;
    };
    error: string;
  }
  | {
    status: "CUSTOM_ERROR";
    data: {
      data: ValidationError["errors"];
      status: FetchBaseQueryError["status"];

      isNotFoundError: boolean;
      isValidationError: true;
      isUnauthorizedError: boolean;
      isUnauthenticatedError: boolean;
    };
    error: string;
  };


export type GetMyTimlineResponse = PaginatedResponse<"timeline", Timeline>

export type GetMyTweetsResponse = PaginatedResponse<"my_tweets", MyTweet>

export type GetFollowersResponse = PaginatedResponse<"followers", User>

export type GetFollowingsResponse = PaginatedResponse<"followings", User>

export interface UnfollowUserRequest {
  user_id: number;
}

export interface UnfollowUserResponse {
  resp: string
}

export interface FollowUserRequest {
  user_id: number;
}

export interface FollowUserResponse {
  resp: string
}

export type GetUsersResponse = PaginatedResponse<"users", User>
export type GetUsersByUsernameResponse = PaginatedResponse<"search_results", User>

export interface SearchUserByNameRequest {
  "token": string
}

export interface MakeTweetLiveRequest {
  "content": string
}


export interface MakeTweetLiveResponse {
  message: string
  tweet: Tweet
}


export interface SearchUserByNameResponse {
  count: number
  search_results: User[]
}


export interface Timeline {
  content: string
  id: number
  published: string
  user: User
}

export interface User {
  active: boolean
  email: string
  id: number
  username: string
}


export interface MyTweet {
  content: string
  id: number
  published: string
  user: User
}
