<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <md-card>
          <md-card-header data-background-color="guinda">
            <h4 class="title">Edición de Estados</h4>
          </md-card-header>
          <md-card-content>
              <div v-if="id != null && id < 1">
                <create-estado :paisid="paisid"></create-estado>
              </div>
              <div v-if="id != null && id != 0">
                <edicion-estado :id="id"></edicion-estado>
              </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>

import CreateEstado from './components/CreateEstado.vue';
import EdicionEstado from './components/EdicionEstado.vue';

export default {
    components: {
        EdicionEstado: EdicionEstado,
        CreateEstado: CreateEstado
    },
    mounted()  {
        this.id = +this.$route.params.id;
        this.paisid = +this.$route.params.paisid;
        console.log("Desde page edicion ", +this.$route.params.paisid)
    },
    data() {
        return {
            id: null,
            paisid: 0
        };
    },

  
};
</script>
