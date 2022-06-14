<template>
  <div class="container">
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import ColumnList, { ColumProps } from "./components/ColumnList.vue";

const testData: ColumProps[] = [
  {
    id: 1,
    title: "Vue.js",
    avatar: "https://avatars0.githubusercontent.com/u/139426?s=460&v=4",
    description: "Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。",
  },
  {
    id: 2,
    title: "Vue.js",
    avatar: "https://avatars0.githubusercontent.com/u/139426?s=460&v=4",
    description: "Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。",
  },
  {
    id: 3,
    title: "Vue.js",
    avatar: "https://avatars0.githubusercontent.com/u/139426?s=460&v=4",
    description: "Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。",
  },
];

export default defineComponent({
  name: "APP",
  components: {
    ColumnList,
  },
  setup() {
    return {
      list: testData,
    };
  },
});
</script>

<style lang="less"></style>
