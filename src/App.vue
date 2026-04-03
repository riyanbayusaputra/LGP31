<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-slate-50">

    <!-- HEADER -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="bg-gradient-to-br from-blue-600 to-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide shadow-sm">
            LPG 3 Kg
          </span>
          <h1 class="text-slate-800 font-bold text-lg tracking-tight">Logbook Penerima</h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="showModal = true"
            class="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
          >
            <ClipboardIcon class="w-4 h-4" />
            Salin Data
          </button>
          <button
            @click="exportPDF"
            :disabled="store.total === 0"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon class="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-5 py-6 space-y-5">

      <!-- STATS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm ring-1 ring-blue-100">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Penerima</p>
          <p class="text-3xl font-extrabold text-blue-600 tabular-nums">{{ store.total }}</p>
        </div>
        <!-- <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Hari Ini</p>
          <p class="text-3xl font-extrabold text-violet-500 tabular-nums">{{ todayCount }}</p>
        </div> -->
        <!-- <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Terakhir Ditambah</p>
          <p class="text-sm font-semibold text-slate-700 mt-1 truncate">{{ lastAdded || '—' }}</p>
        </div> -->
      </div>

      <!-- FORM -->
      <FormEntri />

      <!-- LOADING -->
      <div v-if="store.loading" class="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <div class="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p class="text-sm text-slate-400">Memuat data...</p>
      </div>

      <!-- TABLE -->
      <TabelLogbook v-else />

    </div>

    <!-- MODAL SALIN -->
    <ModalSalin v-model="showModal" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLogbookStore } from './stores/logbook'
import FormEntri    from './components/FormEntri.vue'
import TabelLogbook from './components/TabelLogbook.vue'
import ModalSalin   from './components/ModalSalin.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Heroicons — ganti dengan import dari @heroicons/vue jika sudah install
// atau pakai komponen SVG inline di bawah
import { ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/vue/24/outline'

const store     = useLogbookStore()
const showModal = ref(false)

const todayCount = computed(() => {
  const today = new Date().toDateString()
  return store.entri.filter(e => new Date(e.createdAt).toDateString() === today).length
})

const lastAdded = computed(() => {
  if (!store.entri.length) return null
  return store.entri[store.entri.length - 1].nama
})
async function exportPDF() {
  const doc = new jsPDF()

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Logbook Penerima LPG 3 Kg', 14, 12)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 21)
  doc.text(`Total: ${store.total} penerima`, 160, 21)

  // ✅ FIX DI SINI
  autoTable(doc, {
    startY: 34,
    head: [['No', 'Nama', 'NIK']],
    body: store.entri.map((e, i) => [i + 1, e.nama, e.nik]),
  })

  doc.save(`logbook-lpg-${Date.now()}.pdf`)
}
onMounted(() => store.fetchEntri())
</script>