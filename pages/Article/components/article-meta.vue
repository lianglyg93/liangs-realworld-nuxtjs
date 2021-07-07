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
  },
};
</script>

<style></style>
