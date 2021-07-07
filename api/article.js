import { request } from "@/plugins/request";
// 获取文章列表
export const getArticles = (params) => {
  return request({
    method: "GET",
    url: "/api/articles",
    params,
  });
};
// 获取当前用户喜欢的文章
export const getFeedArticles = (params) => {
  return request({
    method: "GET",
    url: "/api/articles/feed",
    params,
  });
};
// 获取文章标签列表
export const getTags = () => {
  return request({
    method: "GET",
    url: "/api/tags",
  });
};

// 文章点赞
export const favoriteArticle = (slug) => {
  return request({
    method: "POST",
    url: `/api/articles/${slug}/favorite`,
  });
};
// 文章取消点赞
export const unFavoriteArticle = (slug) => {
  return request({
    method: "DELETE",
    url: `/api/articles/${slug}/favorite`,
  });
};

// 获取某个文章信息
export const getSlugArticle = (slug) => {
  return request({
    method: "GET",
    url: `/api/articles/${slug}`,
  });
};

// 获取文章评论
export const getComments = (slug) => {
  return request({
    method: "GET",
    url: `/api/articles/${slug}/comments`,
  });
};

// 添加文章评论
export const addComment = (slug, data) => {
  return request({
    method: "POST",
    url: `/api/articles/${slug}/comments`,
    data,
  });
};

// 删除文章评论
export const deleteComment = (slug, id) => {
  return request({
    method: "DELETE",
    url: `/api/articles/${slug}/comments/${id}`,
  });
};

// 关注作者
export const followUser = (username) => {
  return request({
    method: "POST",
    url: `/api/profiles/${username}/follow`,
  });
};

// 取消关注作者
export const unFollowUser = (username) => {
  return request({
    method: "DELETE",
    url: `/api/profiles/${username}/follow`,
  });
};