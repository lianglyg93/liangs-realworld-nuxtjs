<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit - lsTest</h1>
        <p>A place to share your knowledge...</p>
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
          <article-preview :articles="articles" />
          <!-- 分页 -->
          <nav v-if="totolPage > 1">
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
                :to="{ name: 'home', query: { tag: tagItem, tab: 'tag' } }"
              >{{ tagItem }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, getTags } from "@/api/article";
import { mapState } from "vuex";
import articlePreview from "@/components/article-preview";
export default {
  name: "HomePage",
  watchQuery: ["page", "tab", "tag"],
  components: {
    articlePreview,
  },
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
    // console.log(articles);
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
};
</script>

<style></style>
