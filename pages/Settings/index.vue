<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  v-model="user.image"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="user.username"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  v-model="user.bio"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="user.email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  v-model="user.password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from "@/api/user";
import { mapState } from "vuex";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  name: "SettingPage",
  middleware: "authenticated",
  data() {
    return {
      user: {
        email: "",
        bio: "",
        image: "",
        password: "",
        username: "",
      },
    };
  },
  mounted() {
    this.queryUser();
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    async queryUser() {
      const { data } = await getUser();
      const userInfo = data.user || this.userInfo;
      if (userInfo) {
        const { email, image, bio, username } = userInfo;
        this.user = {
          email,
          image,
          bio,
          username,
          password: this.userInfo.password,
        };
      }
    },
    async onSubmit() {
      if (this.user.password) {
        const { data } = await updateUser(this.user);
        const userInfo = data.user;
        if (userInfo) {
          userInfo.password = this.user.password;
          this.$store.commit("setUserInfo", userInfo);
          Cookie.set("userInfo", userInfo);
          this.$router.push({
            name: "profile",
            params: {
              username: userInfo.username,
            },
          });
        }
      }
    },
    //退出登录
    logout() {
      this.$store.commit("setUserInfo", null);
      Cookie.set("userInfo", null);
      this.$router.push("/");
    },
  },
};
</script>

<style></style>
