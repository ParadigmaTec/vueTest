<template>
  <div style="position:relative">
    <div v-if="loading" style="position: absolute; top: 50px;left:45%">
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div style="margin-bottom:20px;">
      <md-button class="md-fab md-mini md-golden md-just-icon" @click="onClick">
          <md-icon>add</md-icon>
      </md-button>
    </div>
    <md-table v-model="searched" 
              md-sort="nombre" 
              md-sort-order="asc"
              @md-selected="onSelect"
              md-card>
      <md-table-toolbar>
        <div class="md-layout md-gutter">
            <div class="md-layout-item">
                <md-field>
                    <label for="paises">Paises</label>
                    <md-select class="md-primary" v-model="pais" :disabled="loadingPaises" name="paises" id="paises" md-dense >
                        <md-option v-for="(item) in paises" :key="item.id" v-model="item.id">{{item.nombre}}</md-option>
                    </md-select>
                </md-field>
            </div>
            <!-- <div class="md-layout-item">
                <md-field>
                    <label for="estados">Estados</label>
                    <md-select class="md-primary" v-model="estado" :disabled="loadingPaises" name="estados" id="estados" md-dense >
                        <md-option v-for="(item) in estadosDD" :key="item.id" v-model="item.id">{{item.nombre}}</md-option>
                    </md-select>
                </md-field>
            </div> -->
             <div class="md-layout-item">
                <md-field>
                    <md-input placeholder="Buscar" v-model="search" @input="searchOnTable" />
                </md-field>
             </div>
        </div>
      </md-table-toolbar>
       <md-table-empty-state
        md-label="No hay información"
        :md-description="`No hay información para el pais seleccionado.`">
      </md-table-empty-state>
      <md-table-row md-selectable="single" slot="md-table-row" slot-scope="{ item }" :class="getClass(item)">
        <md-table-cell md-label="Cve" width="100px"  md-sort-by="cve">{{ item.cve }}</md-table-cell>
        <md-table-cell md-label="Nombre" md-sort-by="nombre">{{ item.nombre }}</md-table-cell>
        <md-table-cell md-label="Estatus" width="150px" md-sort-by="estatus">{{ item.estatus ? "Activo" : "In Activo" }}</md-table-cell>
        <md-table-cell md-label="Acciones" width="150px">
          <md-button class="md-just-icon md-simple md-golden" @click="e => edit(item, e)">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit</md-tooltip>
          </md-button>
          <md-button class="md-just-icon md-simple md-primary" @click="e => remove(item, e)">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="top">Close</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Edición de Pais</md-dialog-title>
      <md-dialog-content>
        <edicion-estado v-if="selected.id > 0" :id="selected.id" @onSave="onSaveHandler" @onClose="onCloseHandler"></edicion-estado>
        <create-estado v-if="!selected.id" @onSave="onSaveHandler" @onClose="onCloseHandler"></create-estado>
      </md-dialog-content>
    </md-dialog>

  </div>
</template>

<script>

import EdicionEstado from './EdicionEstado.vue';
import CreateEstado from './CreateEstado.vue';
import { getAll, remove, getDD } from '../../../services/data/EstadosDataService';
import { getDD as getPaises } from '../../../services/data/PaisDataService';

const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.nombre).includes(toLower(term)))
  }

  return items
}

export default {
  name: "listado-estados",
  components: {
    EdicionEstado: EdicionEstado,
    CreateEstado: CreateEstado
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selected: {},
      search: null,
      loading: false,
      loadingForm: false,
      estados: [],
      searched: [],
      showDialog: false,
      popUp: false,
      paises: [],
      estadosDD: [],
      pais: 0,
      loadingPaises: false,
      estado: null
    };
  },
  async mounted()  {
    // setTimeout(() => {
    //   this.pais = 1;
    //   this.estado = 1;
    // }, 1000);
  },
  async created() {
    this.paises = [];
    await this.loadPaises();
    await this.onload();
  },
  methods: {
    async onload() {
      this.loading = true;
      const response = await getAll(this.pais)

      if(response.data) {
        this.estados = response.data.map( item => {
          return item;
        })
      }
      this.searched = this.estados;
      this.loading = false;  
    },
    async loadPaises() {
      this.loadingPaises = true;
      const response = await getPaises();
      if(response.data) {
        this.paises = response.data.map( item => {
          return item;
        })
      }
      this.loadingPaises = false;  
      const filtered = this.paises.filter( f => f.nombre.toLowerCase() == "mexico");
      if(filtered)
        this.pais = filtered[0].id;
    },
    async loadEstadosDD() {        
        const response = await getDD(this.pais);
        if(response.data) {
          this.estadosDD = response.data.map( item => {
            return item;
          })
        }
    },
    searchOnTable () {
        this.searched = searchByName(this.estados, this.search)
    },
    getClass: ({ id }) => ({
        'md-primary': id === 2,
        'md-accent': id === 3
      }),
    onSelect (item) {
        this.selected = item;
    },
    async remove(row, e) {
      e.preventDefault();
      this.selected = row;
      this.loading = true;
      await this.delete();
      this.loading = false;
    },
    edit(row, e) {
      if(!this.popUp) {
        this.$router.push(`/estados/${this.pais}/${row.id}`)
      }else {
        e.preventDefault();
        this.selected = row;
        this.showDialog = true;
      }
    },
    closeForm() {
      this.showDialog = false;
      this.selected = {};
      this.onload();
    },
    async delete() {

      if(!this.selected)
        return alert("El estado es requerido para continuar");
      
      const response = await remove(this.selected.id);
      await this.onload();
    },
    onClick() {
      if(!this.popUp) {
        this.$router.push(`/estados/${this.pais}/${0}`)
      }else {
        this.selected = {
          estatus: true
        }
        this.showDialog = true;
      }
    },
    onSaveHandler() {
      this.closeForm();
    },
    onCloseHandler() {
      this.showDialog = false;
    }
  },
  watch: {
    pais: async function(e) {
        await this.onload();
        // if(!this.estado) this.estado = null;
        // await this.loadEstadosDD();
    }
  }
};
</script>

<style scoped>
  .spinner {
    width: "100%"; 
    margin: 0 auto;
  }
</style>

