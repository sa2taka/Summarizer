<template>
  <div class="manual"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class Manual extends Vue {
  // 0から23までの数字の配列を作る
  public hours = [...Array(24).keys()];
  // 上と同様に0から59までの数字の配列をつくる
  public minutes = [...Array(60).keys()];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
