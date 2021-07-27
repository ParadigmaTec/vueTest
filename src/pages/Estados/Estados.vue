<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="guinda">
            <h4 class="title">Estados</h4>
            <p class="category">Listado de Estados</p>
          </md-card-header>
          <md-card-content>
            <listado-estados></listado-estados>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import ListadoEstados from "./components/ListadoEstados.vue";

export default {
  components: {
    ListadoEstados
  }
};
</script>
