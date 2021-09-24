<template>
  <div id="frame">
    <v-progress-linear
      :active="show"
      color="deep-purple accent-4"
      indeterminate
      rounded
      height="6"
    ></v-progress-linear>
    <div v-if="data">
      <div class="titleframe">
        <v-img :src="data.image.url"></v-img>
        <div class="back"></div>
        <h1 class="pagetitle">{{ data.title }}</h1>
      </div>
      <div class="tags">
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
      </div>

      <div>
        <p class="mt-3 mb-0">投稿時間:{{ date(data.createdAt) }}</p>
        <p>最終更新:{{ date(data.updatedAt) }}</p>
      </div>

      <div class="body" v-html="data.text"></div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "Page",

  data: () => ({
    data: null,
    show: true,
  }),
  methods: {
    date: function(time) {
      return dayjs
        .utc(time)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD");
    },
  },
  mounted() {
    this.axios
      .get(
        "https://vueblogs.microcms.io/api/v1/articles/" + this.$route.params.id,
        {
          headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
        }
      )
      .then((res) => {
        this.data = res.data;
        this.show = false;
        document.title = this.data.title + " | Pincer's blog";
      });
  },
};
</script>

<style lang="scss">
#frame {
  margin: 10px auto;
  width: 95%;
  max-width: 1000px;
  .body {
    margin-top: 30px;
  }

  pre {
    padding: 10px;
    color: white;
    background-color: rgb(43, 43, 43);
  }
}

.titleframe {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 20px;

  .v-image {
    object-fit: contain;
    position: absolute;
    height: 100%;
  }

  .back {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.5);
  }

  .pagetitle {
    color: white;
    font-size: 48px;
    margin: 10px 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
