<!-- src/components/FormEntri.vue -->
<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <h2 class="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
      <span class="w-5 h-5 bg-gradient-to-br from-blue-600 to-violet-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
        +
      </span>
      Tambah Penerima
    </h2>

    <div class="flex flex-wrap gap-3 items-end">

      <!-- Nama -->
      <div class="flex flex-col gap-1.5 flex-1 min-w-[180px]">
        <label class="text-xs font-semibold text-slate-500">Nama Lengkap</label>
        <input
          v-model="form.nama"
          type="text"
          placeholder="Contoh: Budi Santoso"
          @keyup.enter="submit"
          class="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
        />
      </div>

      <!-- NIK -->
      <div class="flex flex-col gap-1.5 flex-1 min-w-[180px]">
        <label class="text-xs font-semibold text-slate-500">NIK (16 digit)</label>
        <input
          v-model="form.nik"
          type="text"
          maxlength="16"
          placeholder="3201XXXXXXXXXXXX"
          @keyup.enter="submit"
          class="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
        />
      </div>

      <!-- Tombol -->
      <button
        @click="submit"
        :disabled="loading"
        class="bg-gradient-to-br from-blue-600 to-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Menyimpan...
        </span>
        <span v-else>+ Tambah</span>
      </button>

    </div>

    <!-- Error -->
    <transition name="slide-down">
      <p v-if="error" class="mt-3 text-xs text-red-500 font-medium flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ error }}
      </p>
    </transition>

    <!-- Sukses -->
    <transition name="slide-down">
      <p v-if="sukses" class="mt-3 text-xs text-green-600 font-medium flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Data berhasil ditambahkan!
      </p>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useLogbookStore } from '../stores/logbook'

const store   = useLogbookStore()
const loading = ref(false)
const error   = ref('')
const sukses  = ref(false)
const form    = reactive({ nama: '', nik: '' })

function validate() {
  if (!form.nama.trim())           return 'Nama tidak boleh kosong.'
  if (!form.nik.trim())            return 'NIK tidak boleh kosong.'
  if (!/^\d{16}$/.test(form.nik)) return 'NIK harus 16 digit angka.'
  return ''
}

async function submit() {
  error.value  = validate()
  sukses.value = false
  if (error.value) return

  loading.value = true
  await store.tambahEntri({ nama: form.nama.trim(), nik: form.nik.trim() })
  loading.value = false
  form.nama     = ''
  form.nik      = ''
  error.value   = ''
  sukses.value  = true
  setTimeout(() => { sukses.value = false }, 3000)
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>