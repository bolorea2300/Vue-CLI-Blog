import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import List from "../views/List.vue";
import Tag from "../views/Tag.vue";
import Page from "../views/Page.vue";
import Administrator from "../views/Administrator.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/list",
    name: "list",
    component: List,
  },
  {
    path: "/tag/:id",
    name: "tag",
    component: Tag,
  },
  {
    path: "/page/:id",
    name: "page",
    component: Page,
  },
  {
    path: "/administrator",
    name: "Administrator",
    component: Administrator,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
