<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="guinda">
            <h4 class="title">Edición de Pais</h4>
          </md-card-header>
          <md-card-content>
              <div v-if="id == 0">
                <create-pais></create-pais>
              </div>
              <div v-if="id != 0">
                <edicion-pais :id="id"></edicion-pais>
              </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>

import CreatePais from './components/CreatePais.vue';
import EdicionPais from './components/EdicionPais.vue';

export default {
    components: {
        EdicionPais: EdicionPais,
        CreatePais: CreatePais
    },
    mounted()  {
        this.id = +this.$route.params.id;
    },
    data() {
        return {
            id: 0
        };
    },

  
};
</script>
