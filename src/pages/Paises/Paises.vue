<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="guinda">
            <h4 class="title">Paises</h4>
            <p class="category">Listado de Paises</p>
          </md-card-header>
          <md-card-content>
            <listado-paises></listado-paises>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import ListadoPaises from "./components/ListadoPaises.vue";

export default {
  components: {
    ListadoPaises
  }
};
</script>
