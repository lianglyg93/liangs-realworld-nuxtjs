<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{isLoginPage ? 'Sign in' :'Sign up'}}</h1>
          <p class="text-xs-center" v-if="isLoginPage">
            <nuxt-link to="register">Need an account?</nuxt-link>
          </p>
          <p class="text-xs-center" v-else>
            <nuxt-link to="login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages" v-if="Object.keys(errors).length>0">
            <template v-for="(messages, field) in errors">
              <li v-for="message in messages" :key="field+message">{{field}} {{message}}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLoginPage">
              <input
                v-model="user.username"
                required
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                type="email"
                required
                v-model="user.email"
                class="form-control form-control-lg"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                type="password"
                required
                v-model="user.password"
                class="form-control form-control-lg"
                placeholder="Password"
                minlength="8"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
            >{{isLoginPage ? 'Sign in' :'Sign up'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
import { login, register } from "@/api/user";

export default {
  name: "LoginPage",
  middleware: "notAuthenticated",
  computed: {
    isLoginPage() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      user: {
        username: "",
        email: "747726748@qq.com",
        password: "liangshuang1993",
      },
      errors: {},
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLoginPage
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            });
        this.$store.commit("setUserInfo", data.user);
        Cookie.set("userInfo", data.user);
        this.$router.push("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>