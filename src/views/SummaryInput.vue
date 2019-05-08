<template>
  <div class="summary-input">
    <Subject v-model="selectedSubject"></Subject>
    <Time :date="date" @input-time="atInputTime" @input-date="atInputDate"></Time>

    <div class="add-summry-button">
      <v-btn
        id="subject-add-button"
        fab
        dark
        large
        color="orange"
        class="add-button"
        @click="addSummary"
      >
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
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
  public date: string = new Date().toISOString().substr(0, 10);
  public time: number = 0;

  public atInputDate(value: string) {
    this.date = value;
  }

  public atInputTime(value: number) {
    this.time = value;
  }

  public addSummary() {
    console.log(this.selectedSubject);
    console.log(this.date);
    console.log(this.time);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
