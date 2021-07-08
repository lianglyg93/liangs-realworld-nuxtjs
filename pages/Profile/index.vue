<template>
  <div class="profile-page" v-if="profile">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="clickBtn"
            >
              <i :class="isUser ? 'ion-gear-a' : 'ion-plus-round'"></i>
              &nbsp;
              {{
                isUser
                  ? " Edit Profile Settings"
                  : profile.following
                  ? "unfollow Eric Simons"
                  : "Follow Eric Simons"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'my' }"
                  :to="{ name: 'profile', query: { tab: 'my' } }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'favorited' }"
                  :to="{
                    name: 'profile',
                    query: { tab: 'favorited' },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

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
                  :to="{ name: 'profile', query: { page: pageIndex, tab } }"
                  >{{ pageIndex }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, followUser, unFollowUser } from "@/api/profiles";
import { getArticles } from "@/api/article";
import { mapState } from "vuex";
import articlePreview from "@/components/article-preview";
export default {
  name: "ProfilePage",
  middleware: "authenticated",
  components: {
    articlePreview,
  },
  watchQuery: ["page", "tab"],
  /** 发起请求 */
  async asyncData({ query, params }) {
    const { username } = params;
    const limit = 5; //一页多少条
    const page = parseInt(query.page || 1); //当前第几页

    const queryParam =
      query.tab === "favorited"
        ? { favorited: username }
        : { author: username };
    const [articleRes, profileRes] = await Promise.all([
      getArticles({
        limit,
        offset: (page - 1) * limit,
        ...queryParam,
      }),
      getProfile(username),
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { profile } = profileRes.data;
    articles.forEach((articleItem) => {
      articleItem.disableFavorited = false;
    });
    return {
      articles,
      articlesCount,
      page,
      limit,
      username,
      profile,
      tab: query.tab || "my",
    };
  },
  data() {
    return {
      profile: {},
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    /** 是否本人 */
    isUser() {
      return this.userInfo?.username === this.profile?.username;
    },

    totolPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async clickBtn() {
      if (this.isUser) {
        this.$router.push({
          name: "settings",
        });
      } else {
        const { username, following } = this.profile;
        const { data } = following
          ? await unFollowUser(username)
          : await followUser(username);
        this.profile = data.profile;
      }
    },
  },
};
</script>

<style></style>
