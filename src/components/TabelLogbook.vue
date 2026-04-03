<!-- src/components/TabelLogbook.vue -->
<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

    <!-- Header tabel -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 gap-3 flex-wrap">
      <h2 class="text-sm font-bold text-slate-700">Data Penerima</h2>
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="cari"
          type="text"
          placeholder="Cari nama / NIK..."
          class="border border-slate-200 bg-slate-50 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 w-52 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
        />
        <button v-if="cari" @click="cari = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
          ✕
        </button>
      </div>
    </div>

    <!-- Kosong -->
    <div v-if="hasilFilter.length === 0" class="text-center py-16 text-slate-400">
      <div class="text-5xl mb-4">📋</div>
      <p class="text-sm font-medium">
        {{ cari ? 'Tidak ada hasil untuk "' + cari + '"' : 'Belum ada data penerima.' }}
      </p>
      <p v-if="cari" class="text-xs mt-1 text-slate-300">Coba kata kunci lain.</p>
    </div>

    <!-- Tabel -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100">
            <th class="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-12">No</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Nama</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">NIK</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in hasilFilter"
            :key="item.id"
            class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors last:border-0"
          >
            <!-- MODE NORMAL -->
            <template v-if="editId !== item.id">
              <td class="px-6 py-4 text-xs text-slate-400 font-mono text-center">{{ index + 1 }}</td>

              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                    :style="{ background: getAvatarColor(item.nama) }"
                  >
                    {{ item.nama.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-semibold text-sm text-slate-700">{{ item.nama }}</span>
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                    {{ item.nik }}
                  </span>
                  <button
                    @click="salinNik(item.nik, item.id)"
                    :title="'Salin NIK ' + item.nama"
                    class="text-xs px-2 py-1 rounded-lg border transition-all"
                    :class="disalin === item.id
                      ? 'bg-green-50 border-green-200 text-green-600'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'"
                  >
                    {{ disalin === item.id ? '✔' : '⎘' }}
                  </button>
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="mulaiEdit(item)"
                    class="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all font-medium"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="hapus(item.id)"
                    class="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all font-medium"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Hapus
                  </button>
                </div>
              </td>
            </template>

            <!-- MODE EDIT -->
            <template v-else>
              <td class="px-6 py-3 text-xs text-slate-400 font-mono text-center">{{ index + 1 }}</td>

              <td class="px-4 py-3">
                <input
                  v-model="editForm.nama"
                  placeholder="Nama"
                  class="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
              </td>

              <td class="px-4 py-3">
                <input
                  v-model="editForm.nik"
                  placeholder="NIK"
                  maxlength="16"
                  class="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    @click="simpanEdit(item.id)"
                    class="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Simpan
                  </button>
                  <button
                    @click="editId = null"
                    class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all font-medium"
                  >
                    Batal
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div v-if="hasilFilter.length > 0" class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
      <p class="text-xs text-slate-400">
        Menampilkan <span class="font-semibold text-slate-600">{{ hasilFilter.length }}</span>
        dari <span class="font-semibold text-slate-600">{{ store.total }}</span> penerima
      </p>
      <div v-if="cari" class="text-xs text-blue-500 font-medium bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
        Filter aktif: "{{ cari }}"
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useLogbookStore } from '../stores/logbook'

const store    = useLogbookStore()
const cari     = ref('')
const editId   = ref(null)
const disalin  = ref(null)
const editForm = reactive({ nama: '', nik: '' })

// Warna avatar deterministik berdasarkan huruf pertama
const avatarColors = [
  'linear-gradient(135deg, #3B82F6, #8B5CF6)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #10B981, #06B6D4)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #EF4444, #8B5CF6)',
  'linear-gradient(135deg, #14B8A6, #3B82F6)',
]
function getAvatarColor(nama) {
  const idx = nama.charCodeAt(0) % avatarColors.length
  return avatarColors[idx]
}

const hasilFilter = computed(() => {
  const q = cari.value.toLowerCase().trim()
  if (!q) return store.entri
  return store.entri.filter(e =>
    e.nama.toLowerCase().includes(q) || e.nik.includes(q)
  )
})

async function salinNik(nik, id) {
  try {
    await navigator.clipboard.writeText(nik)
    disalin.value = id
    setTimeout(() => { disalin.value = null }, 2000)
  } catch {
    alert('Gagal menyalin NIK.')
  }
}

function hapus(id) {
  if (confirm('Yakin hapus data ini?')) store.hapusEntri(id)
}

function mulaiEdit(item) {
  editId.value    = item.id
  editForm.nama   = item.nama
  editForm.nik    = item.nik
}

async function simpanEdit(id) {
  await store.updateEntri(id, {
    nama: editForm.nama.trim(),
    nik:  editForm.nik.trim(),
  })
  editId.value = null
}
</script>