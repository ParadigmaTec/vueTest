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
import { create } from '../../../services/data/EstadosDataService';
import { validationMixin } from 'vuelidate';
import {
    required,
    maxLength
} from 'vuelidate/lib/validators';

export default {
  name: "create-estado",
  emits: ['onSave', 'onClose'],
  mixins: [validationMixin],
  props: {
    paisid: {
      type: Number,
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
          paisId: null,
          estatus : true,
      },
      loading: false,
      isSending: false
    };
  },
  validations: {
      form: {
        cve: {
          required,
          maxLength: maxLength(3)
        },
        paisId: {
          required
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
  created() {
    console.log("En create form ", this.paisid);
    this.form.paisId = this.paisid;
  },
  mounted() {
    // console.log("En create form ", this.paisid);
    // this.form.paisId = this.paisid;
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
    async create() {
      this.loading = true;
      console.log(this.form);
      const response = await create(this.form)
      this.isSending = false;
      if(this.popUp)
        this.$emit("onSave",true);
      else 
        this.$router.push(`/estados`)
    },
    validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.create()
        }
    },
    close() {
        if(this.popUp)
          this.$emit("onClose",true);
        else 
          this.$router.push(`/estados`)
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
