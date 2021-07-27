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
              :table-header-color="tableHeaderColor" 
              md-sort="nombre" 
              md-sort-order="asc"
              @md-selected="onSelect"
              md-card>
      <md-table-toolbar>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Buscar" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>
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
        <edicion-pais v-if="selected.id > 0" :id="selected.id" @onSave="onSaveHandler" @onClose="onCloseHandler"></edicion-pais>
        <create-pais v-if="!selected.id" @onSave="onSaveHandler" @onClose="onCloseHandler"></create-pais>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
import EdicionPais from './EdicionPais.vue';
import CreatePais from './CreatePais.vue';
import { getAll, create, remove } from '../../../services/data/PaisDataService';

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
  name: "listado-paises",
  components: {
    EdicionPais: EdicionPais,
    CreatePais: CreatePais
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
      paises: [],
      searched: [],
      showDialog: false,
      popUp: false
    };
  },
  async mounted()  {
    this.paises = [];
    await this.onload()
  },
  methods: {
    async onload() {
      this.loading = true;
      var response = await await getAll();
      this.paises = response.data;
      this.searched = this.paises;
      this.loading = false;  
    },
    searchOnTable () {
        this.searched = searchByName(this.paises, this.search)
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
        this.$router.push(`/paises/${row.id}`)
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
    save(e) {
      e.preventDefault();
      this.create();
    },
    async create() {
      if(!this.selected)
        return alert("Los datos son requeridos");

      this.loadingForm = true;
      const response = await create(this.selected);
      this.loadingForm = false;
      this.showDialog = false;
      this.selected = {}
      this.paises = [];
      await this.onload()
    },
    async delete() {

      if(!this.selected)
        return alert("El pais es requerido para continuar");
      
      await remove(this.selected.id);
      await this.onload();
  
    },
    onClick() {
      if(!this.popUp) {
        this.$router.push(`/paises/${0}`)
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
  }
};
</script>

<style scoped>
  .spinner {
    width: "100%"; 
    margin: 0 auto;
  }
</style>
