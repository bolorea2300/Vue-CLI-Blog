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
      <v-row>
        <v-col
          v-for="(data, number) in articles"
          :key="number"
          cols="12"
          sm="6"
          md="4"
        >
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
              <div>投稿時間:{{ date(data.createdAt) }}</div>
              <div>最終更新:{{ date(data.updatedAt) }}</div>
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
      <div class="mt-50">
        <infinite-loading spinner="spiral" @infinite="pageget">
          <div slot="no-more">全件取得済みです</div>
          <div slot="no-results">取得件数が0です</div>
        </infinite-loading>
      </div>
    </div>
  </v-container>
</template>

<script>
let time;
let waits;

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "Home",

  data: () => ({
    search: "",
    page: 0,
    articles: [],
  }),
  mounted() {
    document.title = "Pincer's blog";
  },
  methods: {
    inputs: function() {
      clearTimeout(waits);
      time = 1000;
      waits = setTimeout(this.pagesearch, time);
    },
    pagesearch: function() {
      this.axios
        .get(
          "https://vueblogs.microcms.io/api/v1/articles?orders=-publishedAt&limit=12&offset=" +
            12 * (this.page - 1) +
            "&filters=title[contains]" +
            this.search,
          {
            headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
          }
        )
        .then((res) => {
          this.page = 1;
          this.articles = res.data.contents;
        });
    },

    date: function(time) {
      return dayjs
        .utc(time)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD");
    },
    pageget($state) {
      this.page += 1;

      if (this.search) {
        this.axios
          .get(
            "https://vueblogs.microcms.io/api/v1/articles?orders=-publishedAt&limit=12&offset=" +
              12 * (this.page - 1) +
              "&filters=title[contains]" +
              this.search,
            {
              headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
            }
          )
          .then((res) => {
            if (res.data.contents.length > 0) {
              for (let i = 0; i < res.data.contents.length; i++) {
                this.articles.push(res.data.contents[i]);
              }
              $state.loaded();
            } else {
              $state.complete();
            }
          });
      } else {
        this.axios
          .get(
            "https://vueblogs.microcms.io/api/v1/articles?orders=-publishedAt&limit=12&offset=" +
              12 * (this.page - 1),
            {
              headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
            }
          )
          .then((res) => {
            if (res.data.contents.length > 0) {
              for (let i = 0; i < res.data.contents.length; i++) {
                this.articles.push(res.data.contents[i]);
              }
              $state.loaded();
            } else {
              $state.complete();
            }
          });
      }
    },
  },
};
</script>

<style lang="scss">
.mt-50 {
  margin-top: 50px;
}
</style>
