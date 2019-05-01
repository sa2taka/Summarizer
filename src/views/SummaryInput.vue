<template>
  <v-tabs dark>
    <v-tab ripple>manual</v-tab>
    <v-tab ripple>with stop watch</v-tab>
    <v-tab-item>manual</v-tab-item>
    <v-tab-item>stop watch</v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SummaryInput extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
