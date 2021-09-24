<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>ホーム</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>プログラミング言語</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(child, id) in tags"
            :key="id"
            :to="'/tag/' + child.tag"
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.tag"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <v-list>
        <v-list-item to="/administrator">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-title>管理人について</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Pincer's blog</v-toolbar-title>
    </v-app-bar>

    <v-main class="mt-ex">
      <router-view v-bind:tags="tags"></router-view>
    </v-main>

    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Pincer's Blog</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    drawer: null,
    tags: [],
  }),
  mounted() {
    this.axios
      .get("https://vueblogs.microcms.io/api/v1/tag?fields=id,tag", {
        headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
      })
      .then((res) => {
        this.tags = res.data.contents;
      });
  },
};
</script>

<style lang="scss">
.mt-ex {
  margin-bottom: 50px;
}
</style>
