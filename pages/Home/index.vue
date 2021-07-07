<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="userInfo">
                <nuxt-link
                  class="nav-link"
                  :to="{ name: 'home', query: { tab: 'your' } }"
                  :class="{ active: tab === 'your' }"
                  exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :to="{ name: 'home', query: { tab: 'global' } }"
                  :class="{ active: tab === 'global' }"
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <span class="nav-link" :class="{ active: tag }" exact># {{ tag }}</span>
              </li>
            </ul>
          </div>
          <!-- 文章列表 -->
          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: { username: article.author.username },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: article.author.username },
                  }"
                  class="author"
                >
                  {{ article.author.username }}
                  <span class="date">{{ article.createdAt | handleDay}}</span>
                </nuxt-link>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="favoritedActive(article)"
                :disabled="article.disableFavorited"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{ name: 'article', params: { slug: article.slug } }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.body }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: pageIndex === page }"
                v-for="pageIndex in totolPage"
                :key="pageIndex"
              >
                <nuxt-link
                  class="page-link"
                  :to="{ name: 'home', query: { page: pageIndex } }"
                >{{ pageIndex }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <!-- 标签 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="(tagItem, index) in tagList"
                :key="tagItem + index"
                class="tag-pill tag-default"
                :to="{ name: 'home', query: { tag: tagItem , tab: 'tag' } }"
              >{{ tagItem }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getFeedArticles,
  getTags,
  favoriteArticle,
  unFavoriteArticle,
} from "@/api/article";
import { mapState } from "vuex";
export default {
  name: "HomePage",
  watchQuery: ["page", "tab", "tag"],
  /** 发起请求 */
  async asyncData({ query, store }) {
    const limit = 20; //一页多少条
    const page = parseInt(query.page || 1); //当前第几页
    const getArticleFun =
      store.state.userInfo && query.tab === "your"
        ? getFeedArticles
        : getArticles;
    const [articleRes, tagsRes] = await Promise.all([
      getArticleFun({
        limit,
        offset: (page - 1) * limit,
        tag: query.tag,
      }),
      getTags(),
    ]);
    const { articles, articlesCount } = articleRes.data;
    console.log(articles);
    articles.forEach((articleItem) => {
      articleItem.disableFavorited = false;
    });
    return {
      articles,
      articlesCount,
      page,
      limit,
      tagList: tagsRes.data.tags,
      tag: query.tag,
      tab: query.tab || "global",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    totolPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    // 取消或者点赞
    async favoritedActive(article) {
      const { slug, favorited } = article;
      article.disableFavorited = true;
      if (article.favorited) {
        //点过赞取消赞
        await unFavoriteArticle(slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await favoriteArticle(slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.disableFavorited = false;
    },
  },
};
</script>

<style></style>
