<template>
  <v-container>
    <div class="mt-3">
      <h1 class="mt-3 tagname">タグ名:{{ $route.params.id }}</h1>
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
    </div>

    <div class="mt-50">
      <infinite-loading spinner="spiral" @infinite="pageget">
        <div slot="no-more">全件取得済みです</div>
        <div slot="no-results">取得件数が0です</div>
      </infinite-loading>
    </div>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "Tag",
  props: ["tags"],
  data: () => ({
    tagid: null,
    page: 0,
    articles: [],
  }),
  mounted() {
    document.title =
      "タグ「" + this.$route.params.id + "」のページ一覧 | Pincer's blog";
    for (let i = 0; i < this.tags.length; i++) {
      if (this.$route.params.id === this.tags[i]["tag"]) {
        this.tagid = this.tags[i]["id"];
        break;
      }
    }
  },
  methods: {
    pageget($state) {
      this.page += 1;
      this.axios
        .get(
          "https://vueblogs.microcms.io/api/v1/articles?orders=-publishedAt&limit=12&offset=" +
            12 * (this.page - 1) +
            "&filters=tags[contains]" +
            this.tagid,
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
    },
    date: function(time) {
      return dayjs
        .utc(time)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD");
    },
  },
  watch: {
    tags() {
      for (let i = 0; i < this.tags.length; i++) {
        if (this.$route.params.id === this.tags[i]["tag"]) {
          this.tagid = this.tags[i]["id"];
          break;
        }
      }
    },
    $route() {
      document.title =
        "タグ「" + this.$route.params.id + "」のページ一覧 | Pincer's blog";
      this.page = 1;
      this.articles = [];

      for (let i = 0; i < this.tags.length; i++) {
        if (this.$route.params["id"] === this.tags[i]["tag"]) {
          this.tagid = this.tags[i]["id"];
          break;
        }
      }

      if (this.tagid != null) {
        this.axios
          .get(
            "https://vueblogs.microcms.io/api/v1/articles?orders=publishedAt&limit=12&offset=" +
              12 * (this.page - 1) +
              "&filters=tags[contains]" +
              this.tagid,
            {
              headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
            }
          )
          .then((res) => {
            this.articles = res.data.contents;
          });
      }
    },
  },
};
</script>

<style lang="scss">
.tagname {
  font-size: 32px;
  text-align: center;
}

.mt-50 {
  margin-top: 50px;
}
</style>
