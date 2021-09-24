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
        <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="data.image.url"
        ></v-img>
        <div class="back"></div>
        <h1 class="pagetitle">{{ data.title }}</h1>
      </div>

      <div class="body" v-html="data.text"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Administrator",

  data: () => ({
    data: null,
    show: true,
  }),
  mounted() {
    this.axios
      .get("https://vueblogs.microcms.io/api/v1/administrator/nrbowwvr20ni", {
        headers: { "X-API-KEY": process.env.VUE_APP_X_API_KEY },
      })
      .then((res) => {
        this.data = res.data;
        this.show = false;
        document.title = "管理人について | Pincer's blog";
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
