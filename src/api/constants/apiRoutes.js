export const ROOT = '/api';

export const ROUTES = {
  user: `${ROOT}/user`,
  users: {
    index: `${ROOT}/users`,
    login: `${ROOT}/users/login`,
  },
  profiles: username => ({
    index: `${ROOT}/profiles/${username}`,
    follow: `${ROOT}/profiles/${username}/follow`,
  }),
  articles: (slug) => ({
    index: `${ROOT}/articles/${slug}`,
    favorite: `${ROOT}/articles/${slug}/favorite`,
    comments: (commentId) => ({
      post: `${ROOT}/articles/${slug}/comments`,
      delete: `${ROOT}/articles/${slug}/comments/${commentId}`,
    })
  }),
};
