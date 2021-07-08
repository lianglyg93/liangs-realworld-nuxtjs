<template>
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
        class="author"
        :to="{
          name: 'profile',
          params: { username: article.author.username },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | handleDay }}</span>
    </div>
    <!-- 本人文章，编辑删除文章 -->
    <template v-if="isUserArticle">
      <span>
        <nuxt-link
          class="btn btn-outline-secondary btn-sm"
          :to="{ name: 'editor', query: { slug: article.slug } }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>
        <button
          class="btn btn-outline-danger btn-sm"
          @click="$emit('deleteArticle')"
        >
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
    <!-- 他人文章，关注，点赞 -->
    <template v-else>
      <button
        class="btn btn-sm action-btn"
        :disabled="article.disableBtn"
        :class="
          article.author.following ? 'btn-secondary' : 'btn-outline-secondary'
        "
        @click="$emit('toFollowUser')"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "UnFollow" : "Follow" }}
        {{ article.author.username }}
      </button>
      &nbsp;
      <button
        class="btn btn-sm"
        :class="article.favorited ? 'btn-primary' : 'btn-outline-primary'"
        :disabled="article.disableBtn"
        @click="$emit('favoritedActive')"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? "unfavorite Article" : "Favorite Article" }}
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: "article-meta",
  props: {
    article: {
      type: Object,
      default: () => {},
      require: true,
    },
    isUserArticle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
