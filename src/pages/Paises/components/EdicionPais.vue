<template>
    <div>
        <div v-if="loading" style="position: absolute; top: 50px;left:45%">
            <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div style="width:500px">
            <form novalidate @submit.prevent="validateUser">
                <md-field :class="getValidationClass('cve')">
                    <label>Clave</label>
                    <md-input id="cve" name="cve" v-model="form.cve" required maxlength="3"></md-input>
                    <span class="md-error" v-if="!$v.form.cve.required">La clave es requerida</span>
                    <span class="md-error" v-else-if="!$v.form.cve.maxlength">La clave es invalida</span>
                </md-field>
                <md-field :class="getValidationClass('nombre')">
                    <label>Nombre</label>
                    <md-input id="nombre" name="nombre" v-model="form.nombre" required maxlength="50"></md-input>
                    <span class="md-error" v-if="!$v.form.cve.required">El nombre es requerido</span>
                    <span class="md-error" v-else-if="!$v.form.cve.maxlength">El nombre es invalido</span>
                </md-field>
                <md-checkbox v-model="form.estatus">Estatus</md-checkbox>
                <div style="display:block">
                    <md-button class="md-primary" type="submit" :disabled="isSending">
                        {{isSending ? "Procesando..." : "Grabar"}}
                    </md-button>
                    <md-button :disabled="isSending" @click="close" class="md-secondary">Cerrar</md-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { get, update } from '../../../services/data/PaisDataService';
import { validationMixin } from 'vuelidate';
import {
    required,
    maxLength
} from 'vuelidate/lib/validators';

export default {
  name: "edit-pais",
  emits: ['onSave'],
  mixins: [validationMixin],
  props: {
    id: {
      type: Number,
      default: 0,
      required: true
    },
    popUp: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      form: {
          cve: null,
          nombre: null,
          estatus : false,
      },
      loading: true,
      isSending: false,
    };
  },
  validations: {
      form: {
        cve: {
          required,
          maxLength: maxLength(3)
        },
        nombre: {
          required,
          maxLength: maxLength(100)
        },
        estatus: {
          required: false
        }
      }
  },
  async mounted()  {
    await this.onload()
  },
  methods: {
    getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
    },
    clearForm () {
        this.$v.$reset()
        this.form.cve = null;
        this.form.nombre = null;
        this.form.estatus = true;
    },
    async onload() {
      this.loading = true;
      const response = await get(this.id);
      this.form = response.data;      
      this.loading = false;  
    },
    async update() {

      this.isSending = true;
      const response = await update(this.form.id, this.form)
      if(response.status == 200) {
            
      }
      this.isSending = false;
      if(this.popUp)
        this.$emit("onSave",true);
      else 
        this.$router.push(`/paises`)
    },
    validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.update()
        }
    },
    close() {
        if(this.popUp)
          this.$emit("onClose",true);
        else 
          this.$router.push(`/paises`)
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
