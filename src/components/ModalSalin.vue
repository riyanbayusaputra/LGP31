<!-- src/components/ModalSalin.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="font-bold text-slate-700 text-sm">Salin Semua Data</h3>
            <button
              @click="$emit('update:modelValue', false)"
              class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all text-sm"
            >
              ✕
            </button>
          </div>

          <!-- Konten -->
          <div class="p-6 space-y-4">
            <p class="text-xs text-slate-500">
              Data akan disalin dalam format teks. Cocok untuk ditempel ke WhatsApp, Excel, atau dokumen lain.
            </p>

            <textarea
              readonly
              :value="teksData"
              rows="8"
              class="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-xs font-mono text-slate-600 resize-none focus:outline-none"
            />

            <div class="flex gap-2">
              <button
                @click="salin"
                class="flex-1 bg-gradient-to-br from-blue-600 to-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                {{ disalin ? '✔ Tersalin!' : '⎘ Salin Semua' }}
              </button>
              <button
                @click="$emit('update:modelValue', false)"
                class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLogbookStore } from '../stores/logbook'

defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const store   = useLogbookStore()
const disalin = ref(false)

const teksData = computed(() => {
  if (!store.entri.length) return 'Belum ada data.'
  return store.entri
    .map((e, i) => `${i + 1}. ${e.nama} | NIK: ${e.nik}`)
    .join('\n')
})

async function salin() {
  try {
    await navigator.clipboard.writeText(teksData.value)
    disalin.value = true
    setTimeout(() => { disalin.value = false }, 2500)
  } catch {
    alert('Gagal menyalin data.')
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; transform: scale(0.95); }
</style>