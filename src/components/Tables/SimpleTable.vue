<template>
  <div style="position:relative">
    <div v-if="loading" style="position: absolute; top: 50px;left:45%">
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div style="margin-bottom:20px;">
      <!-- <md-button class="md-raised" @click="onClick">
        <md-icon>add</md-icon>
        Agregar
      </md-button> -->
      <md-button class="md-fab md-mini md-golden md-just-icon" @click="onClick">
          <md-icon>add</md-icon>
      </md-button>
    </div>
    <md-table v-if="!loading" 
              v-model="searched" 
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
    <!-- <datatable
      width="100%"
      title=" "
      :columns="columns" 
      :rows="paises"
      :clickable="true"
      :sortable="true"
      :exactSearch="false"
      :searchable="true"
      :paginate="true"
      :exportable="true"
      :printable="true"
      :customButtons="actions"
      v-on:row-click="onRowClick"
      locale="es">
        <th slot="thead-tr">
		      Actions
	      </th>
	      <template slot="tbody-tr" scope="props">
          <td>
            <md-button class="md-fab md-mini md-secondary" @click="e => edit(props.row, e)">
                <md-icon>edit</md-icon>
            </md-button>
			      <md-button class="md-fab md-mini md-danger" @click="e => remove(props.row, e)">
                <md-icon>delete</md-icon>
            </md-button>
		      </td>
	      </template>
    </datatable> -->

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Edición de Pais</md-dialog-title>

      <md-dialog-content>
        <div>
          <md-field>
            <label>Clave</label>
            <md-input v-model="selected.cve" required maxlength="3"></md-input>
          </md-field>
          <md-field>
            <label>Nombre</label>
            <md-input v-model="selected.nombre" required maxlength="50"></md-input>
          </md-field>
          <md-checkbox v-model="selected.estatus">Estatus</md-checkbox>
        </div>
      </md-dialog-content>
      

      <md-dialog-actions>
        <md-button class="md-primary" @click="save" :disabled="loadingForm">
          {{loadingForm ? "Procesando..." : "Grabar"}}
        </md-button>
        <md-button :disabled="loadingForm" class="md-secondary" @click="closeForm">Cerrar</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
import axios from 'axios'
//import DataTable from "vue-materialize-datatable";

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
  name: "simple-table",
  // components: {
  //   "datatable": DataTable
  // },
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      url: "http://localhost:5000/api/",
      selected: {},
      search: null,
      loading: false,
      loadingForm: false,
      paises: [],
      searched: [],
      columns: [
        {
          label: "Clave",
          field: "cve",
          numeric: false,
          html: false,
          width: 100,
        },
        {
          label: "Nombre",
          field: "nombre",
          numeric: false,
          html: false,
          width: 500,
        },
        {
          label: "Estatus",
          field: "estatus",
          numeric: false,
          html: false
        }
		  ],
      showDialog: false,
      actions: [
        { 
          hide: false, // Whether to hide the button
          icon: "add", // Materialize icon 
          onclick: this.onClick // Click handler 
        },
        { 
          hide: false, // Whether to hide the button
          icon: "refresh", // Materialize icon 
          onclick: this.onload // Click handler 
        } 
      ]
    };
  },
  async mounted()  {
    this.paises = [];
    await this.onload()
  },
  methods: {
    async onload() {
      this.loading = true;
      const response = await axios.get(`${this.url}paises`)

      if(response.data) {
        this.paises = response.data.map( item => {
          return item;
        })
      }
      this.searched = this.paises;
      this.loading = false;  
    },
    searchOnTable () {
        this.searched = searchByName(this.paises, this.search)
    },
    getClass: ({ id }) => ({
        'md-second': id === 2,
        'md-accent': id === 3
      }),
    onSelect (item) {
        this.selected = item;
    },
    onClick() {
      this.selected = {
        estatus: true
      }
      this.showDialog = true;
    },
    onRowClick(row) {
        this.selected = row;
    },
    async remove(row, e) {
      e.preventDefault();
      this.selected = row;
      this.loading = true;
      await this.deletePais();
      this.loading = false;
    },
    edit(row, e) {
      e.preventDefault();
      this.selected = row;
      this.showDialog = true;
    },
    closeForm(e) {
      e.preventDefault();
      this.showDialog = false;
      this.selected = {};
    },
    save(e) {
      e.preventDefault();
      this.savePais();
    },
    async savePais() {

      if(!this.selected)
        return alert("Los datos son requeridos");

      this.loadingForm = true;
      const response = await axios
        .post(`${this.url}paises`, this.selected)

      
        if(response.status == 200) {
            
        }

        this.loadingForm = false;
        this.showDialog = false;
        this.selected = {}
        this.paises = [];
        await this.onload()
    
    },
    async deletePais() {

      if(!this.selected)
        return alert("El pais es requerido para continuar");
      
      const response = await axios
        .delete(`${this.url}paises/${this.selected.id}`)

      //if(response.status == 200) {
          await this.onload();
      //}

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
