<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    :maximized="$q.screen.xs"
  >
    <q-card :style="$q.screen.xs ? '' : 'width: 512px; max-width: 80vw; min-height: 50vh'">
      <q-form @submit.prevent="send">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Задача</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            :disable="form.isCreator === null ? false : !form.isCreator"
            :readonly="form.isCreator === null ? false : !form.isCreator"
            :filled="form.isCreator === null ? false : !form.isCreator"
            v-model="form.title"
            label="Заголовок"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Поле обязательно для заполнения']"
            :error="!!validationErrors.title"
            :error-message='validationErrors.title'
          />
        </q-card-section>

        <q-card-section class="q-pt-none column">
          <div class="q-pb-xs text-caption">
            Описание задачи
          </div>
          <template v-if="form.isCreator === null ? true : form.isCreator">
            <q-editor
              :content-style="{'overflow-y': 'scroll', height: '10rem'}"
              class="col"
              v-model="form.description"
              :style="styleWYSIWYG"
              @blur="checkDescription"
              :toolbar="[
                [
                  {
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['bold', 'italic', 'strike', 'underline', 'link', 'removeFormat'],
                ['undo', 'redo']
              ]"
            />
            <div class="col flex-center">
                <span class="q-pt-md self-end text-negative">
                  {{ validationErrors.description }}
                </span>
            </div>
          </template>
          <template v-else>
            <q-card flat bordered>
              <q-card-section style="height: 10rem; overflow-y: scroll" v-html="form.description" />
            </q-card>
          </template>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label="Дата завершения"
            :disable="form.isCreator === null ? false : !form.isCreator"
            :readonly="form.isCreator === null ? false : !form.isCreator"
            :filled="form.isCreator === null ? false : !form.isCreator"
            lazy-rules
            :options="optionsDatePicker"
            v-model="form.expiration_at"
            :rules="[
                val => val && val.length > 0 || 'Поле обязательно для заполнения',
                val => (val && new Date(val) > new Date()) || !( this.id === undefined || this.id === null ) || 'Время завершения не может быть в прошлом',
              ]"
            :error="!!validationErrors.expiration_at"
            :error-message='validationErrors.expiration_at'
          >

            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date :options="optionsDatePicker" v-model="form.expiration_at" mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="form.expiration_at" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">

        </q-card-section>

        <q-card-section class="q-pt-none row justify-between q-gutter-sm">
          <q-select
            :disable="form.isCreator === null ? false : !form.isCreator"
            :readonly="form.isCreator === null ? false : !form.isCreator"
            :filled="form.isCreator === null ? false : !form.isCreator"
            class="col"
            v-model="form.priority"
            :options="priorityOptions"
            label="Приоритет"
            :rules="[val => val !== null && val !== undefined || 'Поле обязательно для заполнения']"
            :error="!!validationErrors.priority"
            :error-message='validationErrors.priority'
            option-label="label"
            option-value="value"
            lazy-rules
            map-options
          />
          <q-select
            class="col"
            v-model="form.status"
            :options="statusesOptions"
            label="Статус"
            :rules="[val => val !== null && val !== undefined || 'Поле обязательно для заполнения']"
            :error="!!validationErrors.status"
            :error-message='validationErrors.status'
            option-label="label"
            lazy-rules
            option-value="value"
            map-options
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            :disable="form.isCreator === null ? false : !form.isCreator"
            :readonly="form.isCreator === null ? false : !form.isCreator"
            :filled="form.isCreator === null ? false : !form.isCreator"
            use-input
            input-debounce="0"
            @filter="onUserFilter"
            :rules="[val => val || 'Поле обязательно для заполнения']"
            v-model="form.responsible"
            :options="subordinatesOptions"
            lazy-rules
            label="Ответственный"
            :error="!!validationErrors.responsible"
            :error-message='validationErrors.responsible'
            option-label="label"
            option-value="value"
            map-options
          />
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn label="Отправить" type="Submit" color="primary"/>
          <q-btn label="Отмена" type="button" v-close-popup color="primary" flat class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import {api} from "boot/axios";
import {date, Notify} from "quasar";

export default {
  props: {
    statusesOptions: {
      required: true
    },
    priorityOptions: {
      required: true
    },
    id: {
      type: String,
      required: false
    }
  },

  emits: [
    // REQUIRED
    'ok', 'hide', 'update'
  ],

  created() {
    if(!!this?.id){
      api.get(`/tasks/${this.id}?include=extra`).then(data => {
        this.setForm(data)
      })
    }
  },

  data() {
    return {
      form: {
        title: null,
        description: null,
        expiration_at: null,
        priority: null,
        status: null,
        responsible: null,
        isCreator: null
      },
      validationErrors: {
        title: null,
        description: null,
        expiration_at: null,
        priority: null,
        status: null,
        responsible: null,
      },
      subordinatesOptions: [],
      styleWYSIWYG: null
    }
  },
  methods: {
    setForm(data) {
      this.form = {
        title:  data.data.data.title,
        description:  data.data.data.description,
        expiration_at:  data.data.data.expiration_at,
        priority:  data.data.data.priority,
        status:  data.data.data.status,
        responsible:  data.data.data.responsible.data.id,
        isCreator: data.data.data.isCreator
      }

      this.subordinatesOptions = [
        {
          label: data.data.data.responsible.data.fullname,
          value: data.data.data.responsible.data.id,
        }
      ]
    },
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok')
      this.hide()
    },

    onCancelClick () {
      this.hide()
    },
    checkDescription() {
      if (this.form.description === "" || this.form.description === null) {
        this.styleWYSIWYG = "border: 2px solid;border-color: #C10015;border-radius:5px;";
        this.validationErrors.description = "Поле обязательно для заполнения";
        return false;
      } else {
        this.styleWYSIWYG = "border: 1px solid;border-color: #D1CDC8;border-radius:5px;";
        this.validationErrors.description = null;
        return true;
      }
    },
    optionsDatePicker (d) {
      return d >= date.formatDate(new Date(), 'YYYY/MM/DD');
    },
    optionsTimePicker (d) {
      return d >= date.formatDate(new Date(), 'HH');
    },
    onUserFilter(props, update) {
      api.get(`/subordinates?search=surname:${props};name:${props};patronymic:${props}`).then(data => {
        this.subordinatesOptions = data.data.data.map(item => {
          return {label: item.fullname, value: item.id}
        })

        update(() => {
        })
      })
    },
    catchTaskFormErrors(error) {
      this.validationErrors.title = error.response.data?.errors?.title?.pop()
      this.validationErrors.description = error.response.data?.errors?.description?.pop()
      this.validationErrors.expiration_at = error.response.data?.errors?.expiration_at?.pop()
      this.validationErrors.priority = error.response.data?.errors?.priority?.pop()
      this.validationErrors.status = error.response.data?.errors?.status?.pop()
      this.validationErrors.responsible = error.response.data?.errors?.responsible_user_id?.pop()
    },
    async send () {
      if(!this.checkDescription()) { return false; }

      let formData = {
        title: this.form.title,
        description: this.form.description,
        expiration_at: this.form.expiration_at,
        priority: this.form.priority.value ?? this.form.priority,
        status: this.form.status.value ?? this.form.status,
        responsible_user_id: this.form.responsible.value ?? this.form.responsible,
      }

      if(!!this.id) {
        api.put(`/tasks/${this.id}?include=extra`, formData).then( data => {
          this.setForm(data)
        }).then( () => {
          Notify.create({ type: 'positive', position: 'center' ,message: 'Задача успешно обновлена!', timeout: 1 })
        })
        .catch(error => {
          this.catchTaskFormErrors(error);
        })
      } else {
        api.post(`/tasks?include=extra`, formData).then( data => {
          this.setForm(data)
          Notify.create({ type: 'positive', position: 'top' ,message: 'Задача успешно создана!' })
        })
        .catch(error => {
          this.catchTaskFormErrors(error);
        })
      }


      // this.$emit('update')

    }
  }
}
</script>
