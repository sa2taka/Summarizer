<template>
  <v-app dark>
    <v-toolbar app>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/">Home</v-btn>
        <v-btn flat to="/input">Input</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<style lang="scss">
</style>
