export interface FollowedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  following?: FollowedUser;
  follower?: FollowedUser;
}
