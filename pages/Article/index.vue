<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta
          :isUserArticle="isUserArticle"
          :article="article"
          @toFollowUser="toFollowUser"
          @favoritedActive="favoritedActive"
          @deleteArticle="deleteArticle"
        />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <ul class="tag-list">
        <li
          class="tag-default tag-pill tag-outline"
          v-for="(tagItem, tagIndex) in article.tagList"
          :key="tagItem + tagIndex"
        >
          {{ tagItem }}
        </li>
      </ul>

      <hr />

      <div class="article-actions">
        <article-meta
          :isUserArticle="isUserArticle"
          :article="article"
          @toFollowUser="toFollowUser"
          @favoritedActive="favoritedActive"
          @deleteArticle="deleteArticle"
        />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <!-- 发布评论 -->
          <form class="card comment-form" @submit.prevent="sendComment">
            <div class="card-block">
              <textarea
                v-model="textarea"
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="userInfo.image" class="comment-author-img" />
              <button class="btn btn-sm btn-primary">Post Comment</button>
            </div>
          </form>

          <!-- 评论列表 -->
          <div
            class="card"
            v-for="(comment, index) in comments"
            :key="comment.id"
          >
            <div class="card-block">
              <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
              <nuxt-link
                class="comment-author"
                :to="{
                  name: 'profile',
                  params: { username: comment.author.username },
                }"
              >
                <img
                  :src="comment.author.image"
                  class="comment-author-img"
                /> </nuxt-link
              >&nbsp;
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: { username: comment.author.username },
                }"
                class="comment-author"
                >{{ comment.author.username }}</nuxt-link
              >
              <span class="date-posted">
                {{ comment.createdAt | handleDay }}
              </span>
              <span class="mod-options">
                <i
                  class="ion-trash-a"
                  @click="deleteComment(comment.id, index)"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import articleMeta from "./components/article-meta";
import {
  getSlugArticle,
  getComments,
  addComment,
  deleteComment,
  favoriteArticle,
  unFavoriteArticle,
  deleteArticles,
} from "@/api/article";
import { followUser, unFollowUser } from "@/api/profiles";
import { mapState } from "vuex";
import markdownIt from "markdown-it";
export default {
  name: "ArticlePage",
  middleware: "authenticated",
  async asyncData({ params }) {
    const { slug } = params;
    const { data } = await getSlugArticle(params.slug);
    const md = new markdownIt();
    data.article.body = md.render(data.article.body);
    data.article.disableBtn = false;
    return {
      article: data.article,
      slug,
    };
  },
  data() {
    return {
      comments: [],
      textarea: "",
    };
  },
  head() {
    return {
      title: `${this.article.title} - realWorld`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.article.description,
        },
      ],
    };
  },
  components: {
    articleMeta,
  },
  computed: {
    ...mapState(["userInfo"]),
    /** 是否作者本人 */
    isUserArticle() {
      return this.userInfo?.username === this.article?.author?.username;
    },
  },
  mounted() {
    this.queryComments();
  },
  methods: {
    // 查询评论列表
    async queryComments() {
      const { data } = await getComments(this.slug);
      this.comments = data.comments;
    },
    // 提交评论
    async sendComment() {
      if (this.textarea) {
        const { data } = await addComment(this.slug, {
          comment: {
            body: this.textarea,
          },
        });
        this.comments.unshift(data.comment);
        this.textarea = "";
      }
    },
    // 删除评论
    async deleteComment(id, index) {
      const { data } = await deleteComment(this.slug, id);
      this.comments.splice(index, 1);
    },
    //关注或取消关注作者
    async toFollowUser() {
      const { author } = this.article;
      this.article.disableBtn = true;
      const { data } = author.following
        ? await unFollowUser(author.username)
        : await followUser(author.username);
      // console.log(data);
      this.article.author.following = data.profile.following;
      this.article.disableBtn = false;
    },
    // 取消或者点赞
    async favoritedActive() {
      const { slug, favorited } = this.article;
      this.article.disableBtn = true;
      // console.log(this.article);
      const { data } = favorited
        ? await unFavoriteArticle(slug)
        : await favoriteArticle(slug);

      this.article.favorited = data.article.favorited;
      this.article.favoritesCount = data.article.favoritesCount;
      this.article.disableBtn = false;
    },
    //删除文章
    async deleteArticle() {
      const { data } = await deleteArticles(this.slug);
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>

<style></style>
