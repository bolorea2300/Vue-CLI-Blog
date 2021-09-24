<template>
  <v-container>
    <div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="検索"
        single-line
        hide-details
        @input="inputs"
      ></v-text-field>
    </div>
    <div class="mt-3">
      <v-progress-linear
        :active="show"
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
      <v-row>
        <v-col v-for="(data, number) in articles" :key="number" cols="6" md="4">
          <v-card class="mx-auto my-12" :to="'/page/' + data.id">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-img height="250" :src="data.image.url"></v-img>

            <v-card-title v-text="data.title"></v-card-title>

            <v-card-text>
              <div v-text="data.createdAt"></div>
              <div v-text="data.updatedAt"></div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-title>タグ一覧</v-card-title>

            <v-card-text>
              <v-chip
                v-for="(chip, idvalue) in data.tags"
                :key="idvalue"
                class="ma-2"
                color="primary"
                large
                :to="'/tag/' + chip.tag"
              >
                {{ chip.tag }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="mt-3">
      <v-pagination v-model="page" :length="12"></v-pagination>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "List",

  data: () => ({
    search: "",
    page: 1,
    articles: [],
    show: true,
  }),
  mounted() {
    this.axios
      .get(
        "https://vueblogs.microcms.io/api/v1/articles?orders=publishedAt&limit=12&offset=" +
          12 * (this.page - 1),
        {
          headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
        }
      )
      .then((res) => {
        this.show = false;
        this.articles = res.data.contents;
      });
  },
  methods: {
    inputs: function() {
      this.show = true;
      this.axios
        .get(
          "https://vueblogs.microcms.io/api/v1/articles?orders=publishedAt&limit=12&offset=" +
            12 * (this.page - 1) +
            "&filters=title[contains]" +
            this.search,
          {
            headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
          }
        )
        .then((res) => {
          this.show = false;
          this.page = 1;
          this.articles = res.data.contents;
        });
    },
  },
  watch: {
    page: function(newVal) {
      this.show = true;
      this.axios
        .get(
          "https://vueblogs.microcms.io/api/v1/articles?orders=publishedAt&limit=12&offset=" +
            12 * (newVal - 1),
          {
            headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
          }
        )
        .then((res) => {
          this.show = false;
          this.articles = res.data.contents;
        });
    },
  },
};
</script>
