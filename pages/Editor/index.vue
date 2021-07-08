<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  required
                  v-model="article.title"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="article.description"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  required
                  v-model="article.body"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="article.tagList"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="submitArticle"
                :disabled="disableBtn"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticles, getSlugArticle, updateArticles } from "@/api/article";
export default {
  name: "EditArticlePage",
  middleware: "authenticated",
  data() {
    return {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: "",
      },
      disableBtn: false,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    slug() {
      return this.$route.query.slug;
    },
  },
  methods: {
    init() {
      if (this.slug) {
        this.queryArticleInfo();
      }
    },
    // 查询文章
    async queryArticleInfo() {
      const { data } = await getSlugArticle(this.slug);
      if (data.article) {
        const { title, description, body, tagList } = data.article;
        this.article = {
          title: title,
          description: description,
          body: body,
          tagList: tagList.join(","),
        };
      }
      // console.log(this.article);
    },
    async submitArticle() {
      this.disableBtn = true;
      const article = {
        ...this.article,
        tagList: this.article.tagList.split(","),
      };
      const { data } = this.slug
        ? await updateArticles(this.slug, article)
        : await createArticles({
            article,
          });

      this.disableBtn = false;
      if (data?.article?.slug) {
        this.$router.push({
          name: "article",
          params: { slug: data.article.slug },
        });
      }
    },
  },
};
</script>

<style></style>
