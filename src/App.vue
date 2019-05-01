<template>
  <v-app dark>
    <v-toolbar app>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/">Home</v-btn>
        <v-btn flat to="/input">Input</v-btn>
        <v-btn flat to="/signin">Singin</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content grid-list-md text-xs-center class="main-container">
      <router-view/>
    </v-content>
  </v-app>
</template>

<style lang="scss">
.main-container {
  position: relative;
  width: 80%;
  left: 10%;
}
</style>
