<template>
  <div class="summary-input">
    <Subject v-model="selectedSubject"></Subject>
    <Time></Time>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Time from '@/components/SummaryInput/Time.vue';
import Subject from '@/components/SummaryInput/Subject.vue';

@Component({
  components: {
    Time,
    Subject,
  },
})
export default class SummaryInput extends Vue {
  public selectedSubject: string = '';
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
