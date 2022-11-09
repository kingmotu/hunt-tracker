<template>
  <div class="about">
    <h1>This is an about page</h1>
    <v-card
      width="400"
      title="This is a title"
      subtitle="This is a subtitle"
      text="This is content"
    ></v-card>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
