<template>
  <div>
    <template v-if="articles.length > 0">
      <!-- 文章列表 -->
      <div
        class="article-preview"
        v-for="article in articles"
        :key="article.slug"
      >
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
              <span class="date">{{ article.createdAt | handleDay }}</span>
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
    </template>
    <div v-else class="article-preview">
      No articles are here... yet.
    </div>
  </div>
</template>

<script>
import { favoriteArticle, unFavoriteArticle } from "@/api/article";
export default {
  props: {
    articles: {
      type: Array,
      default: () => [],
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
