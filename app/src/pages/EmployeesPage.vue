<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Сотрудники</div>
    </div>

    <q-table
      :rows="store.employees"
      :columns="columns"
      row-key="id"
      :loading="store.loading"
      flat
      bordered
    >
      <template v-slot:top-right>
        <q-btn color="primary" icon="add" label="Добавить сотрудника" @click="openDialog()" />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn flat round dense icon="edit" color="primary" @click="openDialog(props.row)" />
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click="confirmDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 850px; max-width: 95vw">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ isEdit ? 'Редактирование' : 'Новый сотрудник' }}</div>
          <q-spacer />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="main" label="Личные" />
            <q-tab name="passport" label="Паспорт" />
            <q-tab name="address" label="Адрес" />
            <q-tab name="files" label="Файлы" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated class="q-pa-md">
            <q-tab-panel name="main" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <q-input v-model="form.last_name" label="Фамилия *" class="col-4" outlined dense />
                <q-input v-model="form.first_name" label="Имя *" class="col-4" outlined dense />
                <q-input v-model="form.patronymic" label="Отчество" class="col-4" outlined dense />
                <q-input
                  v-model="form.birth_date"
                  type="date"
                  label="Дата рождения"
                  class="col-6"
                  outlined
                  dense
                  stack-label
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="passport" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="form.passport_series"
                  label="Серия"
                  class="col-3"
                  outlined
                  dense
                  mask="####"
                />
                <q-input
                  v-model="form.passport_number"
                  label="Номер"
                  class="col-3"
                  outlined
                  dense
                  mask="######"
                />
                <q-input
                  v-model="form.passport_issue_date"
                  type="date"
                  label="Дата выдачи"
                  class="col-6"
                  outlined
                  dense
                  stack-label
                />
                <q-input
                  v-model="form.passport_department_code"
                  label="Код подразделения"
                  class="col-4"
                  outlined
                  dense
                />
                <q-input
                  v-model="form.passport_issued_by"
                  label="Кем выдан"
                  class="col-8"
                  outlined
                  dense
                  autogrow
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="address" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="form.address_region"
                  label="Область"
                  class="col-6"
                  outlined
                  dense
                />
                <q-input
                  v-model="form.address_locality"
                  label="Населенный пункт"
                  class="col-6"
                  outlined
                  dense
                />
                <q-input
                  v-model="form.address_street"
                  label="Улица"
                  class="col-12"
                  outlined
                  dense
                />
                <q-input v-model="form.address_house" label="Дом" class="col-4" outlined dense />
                <q-input v-model="form.address_block" label="Корпус" class="col-4" outlined dense />
                <q-input
                  v-model="form.address_apartment"
                  label="Квартира"
                  class="col-4"
                  outlined
                  dense
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="files">
              <q-file
                v-model="files"
                label="Сканы паспорта"
                outlined
                dense
                multiple
                use-chips
                accept=".pdf,.jpg,.jpeg,.png"
              >
                <template v-slot:prepend><q-icon name="attach_file" /></template>
              </q-file>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn color="primary" label="Сохранить" @click="save" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmployeeStore } from 'src/stores/employees';
import { useQuasar } from 'quasar';

const store = useEmployeeStore();
const $q = useQuasar();

const tab = ref('main');
const showDialog = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const saving = ref(false);
const files = ref([]);

const columns = [
  {
    name: 'first_name',
    label: 'Имя',
    field: (row: any) => `${row.last_name} ${row.first_name} ${row.patronymic}`,
    align: 'left' as const,
    sortable: true,
  },
  { name: 'birth_date', label: 'Дата рожд.', field: 'birth_date', align: 'left' as const },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'right' as const },
];

const emptyForm = {
  last_name: '',
  first_name: '',
  patronymic: '',
  birth_date: '',
  department_id: null,
  position_id: null,
  passport_series: '',
  passport_number: '',
  passport_issue_date: '',
  passport_department_code: '',
  passport_issued_by: '',
  address_region: '',
  address_locality: '',
  address_street: '',
  address_house: '',
  address_block: '',
  address_apartment: '',
};

const form = ref({ ...emptyForm });

onMounted(() => store.fetchEmployees());

const openDialog = (row: any = null) => {
  isEdit.value = !!row;
  currentId.value = row?.id || null;
  form.value = row ? { ...row } : { ...emptyForm };
  files.value = [];
  tab.value = 'main';
  showDialog.value = true;
};

const save = async () => {
  if (!form.value.last_name || !form.value.first_name) {
    $q.notify({ type: 'warning', message: 'Заполните обязательные поля: Фамилия и Имя' });
    tab.value = 'main';
    return;
  }

  saving.value = true;
  try {
    if (isEdit.value && currentId.value) {
      await store.updateEmployee(currentId.value, form.value, files.value);
    } else {
      await store.createEmployee(form.value, files.value);
    }

    $q.notify({
      type: 'positive',
      message: 'Сохранено',
    });
    showDialog.value = false;
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Ошибка сохранения',
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (row: any) => {
  $q.dialog({
    title: 'Удаление',
    message: `Удалить сотрудника ${row.last_name}?`,
    cancel: true,
  }).onOk(() => store.deleteEmployee(row.id));
};
</script>
